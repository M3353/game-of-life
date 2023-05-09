const sharp = require("sharp");
const { PythonShell } = require("python-shell");

const prisma = require("./prisma");
const { kMean } = require("./filters");
const { getImage, putImage, deleteImage } = require("./s3-client");
const { PALETTE_SIZE, EPS } = require("./constants");
const { labToRgb } = require("./filters-utils");

async function removeBackground(id, file) {
  const filePath = id + "/" + file;

  // remove background
  const pythonShellOptions = {
    pythonOptions: ["-u"],
    args: [
      filePath,
      process.env.S3_BUCKET,
      process.env.ACCESS_KEY,
      process.env.SECRET_ACCESS_KEY,
    ],
    ...(process.env.NODE_ENV !== "production" && {
      pythonPath: "/Users/jackli/.pyenv/versions/3.10.11/bin/python/",
    }),
  };

  try {
    await PythonShell.run(
      "background-remover/remove.py",
      pythonShellOptions
    ).then((results) => console.log(results));
  } catch (err) {
    deleteImage(filePath);
    throw err;
  }
}

async function applyFilter(data, info) {
  const pixelArray = new Float32Array(data.buffer);
  const { width, height, channels, size } = info;

  const clusters = kMean(pixelArray, info, PALETTE_SIZE);
  const colors = [];

  clusters.forEach((cluster) => {
    const { l, a, b } = cluster.centroid;
    const rgbCentroid = labToRgb([l, a, b]);
    colors.push({
      color: rgbCentroid,
      weight: cluster.points.length / (width * height),
    });
    cluster.points.forEach((i) => {
      for (let c = 0; c < channels; c++) {
        if (c < rgbCentroid.length)
          pixelArray[i + c] = parseInt(rgbCentroid[c]);
      }
    });
  });
  return { pixelArray, colors };
}

function uniqueSort(arr) {
  arr.sort((a, b) => b.weight - a.weight);
  const ret = [{ color: arr[0].color, weight: arr[0].weight }];
  for (let i = 1; i < arr.length; i++) {
    const c1 = arr[i].color;
    const c2 = arr[i - 1].color;
    for (let j = 0; j < c1.length; j++) {
      if (Math.abs(c1[j] - c2[j]) > EPS) {
        ret.push({ color: c1, weight: arr[i].weight });
        break;
      }
    }
  }

  return ret;
}

async function uploadUserImage(id, file, palette) {
  const filePath = id + "/" + file;

  // get image from s3 and convert to byte stream
  const imageFromS3 = await getImage(filePath);

  // try to get sharp metadata - if error, return
  try {
    await sharp(imageFromS3).metadata();
  } catch (err) {
    deleteImage(filePath);
    throw err;
  }

  // resize and blur image using sharp
  const { data, info } = await sharp(imageFromS3)
    .resize({ fit: sharp.fit.contain, width: 400 })
    .modulate({
      saturation: 2,
    })
    .gamma()
    .trim()
    .median()
    .toColorspace("lab")
    .raw({ depth: "float" })
    .toBuffer({ resolveWithObject: true });

  // manually process image
  const { pixelArray, colors } = await applyFilter(data, info);

  // convert raw data to buffer
  const { width, height, channels } = info;

  // put image to s3
  const imageToS3 = await sharp(new Uint8ClampedArray(pixelArray), {
    raw: { width, height, channels },
  })
    .toFormat("png")
    .toBuffer();

  putImage(imageToS3, filePath);

  // sort colors by weight and put it in req body
  const newPaletteData = [...palette, ...colors];
  uniqueSort(newPaletteData);

  prisma.board.update({
    where: { id },
    data: {
      palette: { data: newPaletteData },
    },
  });
}

module.exports = {
  removeBackground,
  uploadUserImage,
};
