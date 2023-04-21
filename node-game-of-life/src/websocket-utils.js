require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const axios = require("axios");
const { dataSize, entrySize } = require("./data");

const inBoard = (x, y, nr, nc) => {
  return x >= 0 && y >= 0 && x < nc && y < nr;
};

const incrementBoardHelper = (entry) => {
  const { board, rows, columns, name, id, occupied, ready } = entry;

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

    const r = i / columns;
    const c = i % columns;

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

const getHighDensityRegions = (entry) => {
  const { board, rows, columns, name, id, occupied, ready } = entry;
  const highDensityRegions = [];

  const regionSize = entrySize - 2;

  // snakewise pass
  for (
    let i = parseInt(regionSize / 2);
    i < rows - parseInt(regionSize / 2);
    i++
  ) {
    // handle first case
    if (highDensityRegions.length == 0) {
      let sum = 0;
      for (let x = 0; x < regionSize; x++) {
        for (let y = 0; y < regionSize; y++) {
          sum += board.data[x * columns + y];
        }
      }
      highDensityRegions.push({
        sum,
        idx: parseInt(((regionSize / 2) * regionSize) / 2),
      });
    }

    let sum = highDensityRegions[highDensityRegions.length - 1].sum;

    // handle snake wise turn case.
    if (i != parseInt(regionSize / 2)) {
      let start = i % 2 == 0 ? parseInt(regionSize / 2) : columns - regionSize;
      const end = start + regionSize;
      for (let k = start; k < end; k++) {
        sum -= board.data[i + columns * k];
        sum += board.data[i + regionSize - 1 + columns * k];
      }
    }

    let left = 0,
      right = 0;
    for (
      let j = parseInt(regionSize / 2);
      j < columns - parseInt(regionSize / 2);
      j++
    ) {
      for (let k = 0; k < regionSize; k++) {
        left += board.data[i + k + columns * (j - parseInt(regionSize / 2))];
        right +=
          board.data[i + k + columns * (j + parseInt(regionSize / 2)) - 1];
      }

      sum = i % 2 == 0 ? sum + right - left : sum + left - right;

      highDensityRegions.push({ sum, idx: i + columns * j });
    }
  }

  // filter to occupied.length
  highDensityRegions.sort((a, b) => a.sum - b.sum);
  if (highDensityRegions.length > occupied.data.length) {
    highDensityRegions.splice(
      0,
      highDensityRegions.length - occupied.data.length
    );
  }

  return {
    board,
    id,
    name,
    occupied,
    rows,
    columns,
    ready,
    highDensityRegions: { data: highDensityRegions },
  };
};

const incrementAllBoards = (boards) => {
  const incrementedBoards = boards.map((entry) =>
    // increment board only when ready
    entry.ready ? incrementBoardHelper(entry) : entry
  );
  return incrementedBoards;
};

const getHighDensityRegionsAllBoards = (boards) => {
  const allBoardsHighDensityRegions = boards.map((entry) =>
    entry.ready ? getHighDensityRegions(entry) : entry
  );
  return allBoardsHighDensityRegions;
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
  const postURL = `${process.env.NEXT_PUBLIC_URL}/admin`;
  for (const entry of data) {
    const incrementedBoard = {
      board: entry.board,
      id: entry.id,
      highDensityRegions: entry.highDensityRegions,
    };
    await axios.post(postURL, incrementedBoard);
  }
}

async function broadcast(clients) {
  const url = `${process.env.NEXT_PUBLIC_URL}/boards`;
  await waitInterval(async function () {
    const res = await axios.get(url);

    // increment data here
    res.data = incrementAllBoards(res.data);

    // add high density regions to response
    res.data = getHighDensityRegionsAllBoards(res.data);

    // update incremented board
    await updateBoardWithIncremented(res.data);

    const data = JSON.stringify(res.data);
    for (let c of clients.values()) {
      c.send(data);
    }
  }, 3000);
  return res.data;
}

module.exports = {
  broadcast,
  updateBoardWithIncremented,
  getHighDensityRegions,
};
