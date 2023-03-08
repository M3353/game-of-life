const prisma = require("./prisma");
require("dotenv").config();

async function createBoard(req, res) {
  const { id, name, rows, columns, board, occupied, ready } = req.body;

  try {
    const newBoard = await prisma.board.create({
      data: {
        id: id,
        name: name,
        board: board,
        occupied: occupied,
        rows: rows,
        columns: columns,
        ready: ready,
      },
    });
    res.status(201).json(newBoard).send(`Board added with ID: ${id}.`);
  } catch (e) {
    // error handler
    throw e;
  }
}

async function deleteBoard(req, res) {
  const id = parseInt(req.params.id);
  try {
    const board = await prisma.board.delete({
      where: {
        id,
      },
    });
    res.status(200).json(board).send(`Board deleted with ID: ${id}`);
  } catch (e) {
    throw e;
  }
}

async function incrementBoard(req, res) {
  const { board, id } = req.body;

  try {
    const incrementedBoard = await prisma.board.update({
      where: { id },
      data: { board: board },
    });
    res
      .status(200)
      .json(incrementedBoard)
      .send(`Board ${id} incremented successfully.`);
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

async function updateBoard(req, res) {
  const id = parseInt(req.params.id);
  const { board, occupied, ready } = req.body;

  try {
    const updatedBoard = await prisma.board.update({
      where: { id },
      data: { board: board, occupied: occupied, ready: ready },
    });
    res
      .status(200)
      .json(updatedBoard)
      .send(`Board ${id} incremented successfully.`);
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
