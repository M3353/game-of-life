const { PythonShell } = require("python-shell");
const { deleteImage } = require("./s3-client");

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
    res.status(401).send({
      message: `[ERROR] error when attempting to remove background ${filePath}`,
    });
  }
}

module.exports = {
  removeBackground,
};
