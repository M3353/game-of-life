const prisma = require("./prisma");
require("dotenv").config();

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
    console.log(fetchedBoard);
    res.status(200).json(fetchedBoard);
  } catch (e) {
    throw e;
  }
}

async function updateBoard(req, res) {
  const id = parseInt(req.params.id);
  const { board, occupied, ready, palette } = req.body;
  try {
    const updatedBoard = await prisma.board.update({
      where: { id },
      data: {
        board: board,
        occupied: occupied,
        ready: ready,
        palette: palette,
      },
    });
    res.status(200).send(`Board ${id} incremented successfully.`);
  } catch (e) {
    throw e;
  }
}

module.exports = {
  createBoard,
  deleteBoard,
  incrementBoard,
  getBoards,
  getBoardById,
  updateBoard,
};
