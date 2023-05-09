const { v4: uuidv4 } = require("uuid");

const prisma = require("./prisma");
const { removeBackground, uploadUserImage } = require("./background_tasks");
const { emptyS3Directory } = require("./s3-client");

require("dotenv").config();

const jobs = {};

async function createBoard(req, res) {
  const {
    name,
    rows,
    columns,
    board,
    occupied,
    ready,
    highDensityRegions,
    palette,
  } = req.body;

  try {
    const newBoard = await prisma.board.create({
      data: {
        name: name,
        board: board,
        occupied: occupied,
        rows: rows,
        columns: columns,
        ready: ready,
        highDensityRegions,
        palette,
      },
    });
    res.status(201).send(`Board added`);
  } catch (e) {
    // error handler
    throw e;
  }
}

async function deleteBoard(req, res) {
  const id = parseInt(req.params.id);
  try {
    await prisma.board.delete({
      where: {
        id,
      },
    });
    res.status(200).send(`Board deleted with ID: ${id}`);
    res.on("finish", () => {
      emptyS3Directory(id);
    });
  } catch (e) {
    throw e;
  }
}

async function incrementBoard(req, res) {
  const { board, id, highDensityRegions } = req.body;

  try {
    await prisma.board.update({
      where: { id },
      data: { board, highDensityRegions },
    });
    res.status(200).send(`Board ${id} incremented successfully.`);
  } catch (e) {
    throw e;
  }
}

async function getBoards(req, res) {
  try {
    const boards = await prisma.board.findMany({
      orderBy: [{ name: "desc" }],
    });

    res.status(200).json(boards);
  } catch (e) {
    throw e;
  }
}

async function getBoardById(req, res) {
  const id = parseInt(req.params.id);

  try {
    const fetchedBoard = await prisma.board.findMany({
      where: {
        id: id,
      },
    });
    res.status(200).json(fetchedBoard);
  } catch (e) {
    throw e;
  }
}

async function updateBoard(req, res, next) {
  const id = parseInt(req.params.id);
  const { board, occupied, ready, file, palette } = req.body;
  try {
    const updatedBoard = await prisma.board.update({
      where: { id },
      data: {
        board: board,
        occupied: occupied,
        ready: ready,
      },
    });

    const jobId = uuidv4();
    Promise.all([
      removeBackground(id, file),
      uploadUserImage(id, file, palette),
    ]).then((values) => {
      jobs[jobId] = values;
    });

    res.redirect(303, `/image/${jobId}`);
    next();
    // res.status(200).send(`Board ${id} incremented successfully.`);
    // res.on("finish", () => {
    //   removeBackground(id, file);
    // });
  } catch (e) {
    throw e;
  }
}

async function processImage(req, res) {
  if (jobs[req.params.jobId] === undefined) {
    console.log("processing request");
    res.status(200).send("Still processing your request.");
  } else {
    console.log(`${jobs[req.params.uuid]}.`);
    res.status(200).send(`Here's your result: ${jobs[req.params.uuid]}.`);
    // instead of immediately deleting the result of the job (and making it impossible for the user
    // to fetch it a second time if they e.g. accidentally cancel the download), it would be better
    // to run a periodic cleanup task on `JOBS`
    delete jobs[req.params.jobId];
  }
}

module.exports = {
  createBoard,
  deleteBoard,
  incrementBoard,
  getBoards,
  getBoardById,
  updateBoard,
  processImage,
};
