const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.REGION,
  credentials: {
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    accessKeyId: process.env.ACCESS_KEY,
  },
});

async function getImage(file) {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: file,
  };

  try {
    const imageFromS3 = (await s3.send(new GetObjectCommand(params))).Body;
    return imageFromS3;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function putImage(img, file) {
  const putParams = {
    Bucket: process.env.S3_BUCKET,
    Key: file,
    Body: img,
    ContentType: "image/png",
    ContentLength: img.length,
  };

  try {
    const response = await s3.send(new PutObjectCommand(putParams));
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = { getImage, putImage };
