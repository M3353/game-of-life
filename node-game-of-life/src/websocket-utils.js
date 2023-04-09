require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const axios = require("axios");

const inBoard = (x, y, nr, nc) => {
  return x >= 0 && y >= 0 && x < nc && y < nr;
};

const incrementBoardHelper = (entry) => {
  const { board, rows, columns, occupied, ready, id, name } = entry;

  const offsets = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [-1, -1],
    [1, -1],
    [1, 1],
  ];

  const incrementedBoard = board.data.map((ele, i) => {
    let alive = 0;

    const r = i / rows;
    const c = i / columns;

    offsets.forEach((coord) => {
      const x = coord[0] + c;
      const y = coord[1] + r;

      alive +=
        inBoard(x, y, rows, columns) && board.data[y * rows + x] > 0 ? 1 : 0;
    });

    return ele > 0 && (alive == 2 || alive == 3)
      ? ele + 1
      : ele == 0 && alive == 3
      ? 1
      : 0;
  });

  return {
    board: { data: incrementedBoard },
    id,
    name,
    occupied,
    rows,
    columns,
    ready,
  };
};

const incrementAllBoards = (boards) => {
  const incrementedBoards = boards.map((entry) =>
    // increment board only when ready
    entry.ready ? incrementBoardHelper(entry) : entry
  );
  return incrementedBoards;
};

async function waitInterval(callback, ms) {
  return new Promise((resolve) => {
    let iteration = 0;
    const interval = setInterval(async () => {
      if (await callback(iteration, interval)) {
        resolve();
        clearInterval(interval);
      }
      iteration++;
    }, ms);
  });
}

async function updateBoardWithIncremented(data) {
  const postURL = `${process.env.NEXT_PUBLIC_VERCEL_URL}/admin`;
  for (const entry of data) {
    const incrementedBoard = {
      board: entry.board,
      id: entry.id,
    };
    await axios.post(postURL, incrementedBoard);
  }
}

async function broadcast(clients) {
  const url = `${process.env.NEXT_PUBLIC_VERCEL_URL}/boards`;
  let incrementedBoards = [];
  await waitInterval(async function () {
    const res = await axios.get(url);

    // increment data here
    incrementedBoards = incrementAllBoards(res.data);

    // update incremented board
    await updateBoardWithIncremented(incrementedBoards);

    const data = JSON.stringify(incrementedBoards);
    for (let c of clients.values()) {
      c.send(data);
    }
  }, 3000);
  return incrementedBoards;
}

module.exports = {
  broadcast,
  updateBoardWithIncremented,
};
