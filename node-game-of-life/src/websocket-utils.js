require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const axios = require("axios");
const { ENTRY_SIZE, INCREMENT } = require("./constants");

const inBoard = (x, y, nr, nc) => {
  return x >= 0 && y >= 0 && x < nc && y < nr;
};

const incrementBoardHelper = (entry) => {
  const { board, rows, columns } = entry;

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

  let sum = 0;

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

    const newEle =
      ele > 0 && (alive == 2 || alive == 3)
        ? ele + 1
        : ele == 0 && alive == 3
        ? 1
        : 0;

    sum += newEle;
    return newEle;
  });

  entry.finished = sum == 0 ? true : false;
  entry.board = { data: sum == 0 ? board.data : incrementedBoard };
  return entry;
};

const incrementAllBoards = (boards) => {
  const incrementedBoards = boards.map((entry) =>
    // increment board only when ready
    entry.ready ? incrementBoardHelper(entry) : entry
  );
  return incrementedBoards;
};

const getSumFirstRegion = (regionSize, entry) => {
  const { board, columns } = entry;
  let sum = 0;
  for (let y = 0; y < regionSize; y++) {
    for (let x = 0; x < regionSize; x++) {
      const idx = y * columns + x;
      sum += board.data[idx];
    }
  }
  return sum;
};

const getSumSnakewiseTurnRegion = (regionSize, entry, prevSum, i, j) => {
  const { board, columns } = entry;
  const radius = parseInt(regionSize / 2);
  let sum = prevSum;
  const start = j - radius;
  const end = start + regionSize;
  for (let k = start; k < end; k++) {
    for (let l = 1; l <= INCREMENT; l++) {
      const topIdx = (i - radius - l) * columns + k;
      const bottomIdx = (i + radius - INCREMENT + l) * columns + k;

      sum -= board.data[topIdx];
      sum += board.data[bottomIdx];
    }
  }
  return sum;
};

const getSumSnakewiseIterateRegionRight = (radius, entry, prevSum, i, j) => {
  const { board, columns } = entry;
  let sum = prevSum;
  for (let k = -radius; k <= radius; k++) {
    for (let l = 1; l <= INCREMENT; l++) {
      const leftIdx = (i + k) * columns + (j - radius - l);
      const rightIdx = (i + k) * columns + (j + radius - INCREMENT + l);
      sum += board.data[rightIdx] - board.data[leftIdx];
    }
  }
  return sum;
};

const getSumSnakewiseIterateRegionLeft = (radius, entry, prevSum, i, j) => {
  const { board, columns } = entry;
  let sum = prevSum;
  for (let k = -radius; k <= radius; k++) {
    for (let l = 1; l <= INCREMENT; l++) {
      const leftIdx = (i + k) * columns + (j - radius + INCREMENT - l);
      const rightIdx = (i + k) * columns + (j + radius + l);
      sum += board.data[leftIdx] - board.data[rightIdx];
    }
  }
  return sum;
};

const getHighDensityRegions = (entry) => {
  const { rows, columns } = entry;
  let highDensityRegions = [];

  const regionSize = ENTRY_SIZE;
  const radius = parseInt(regionSize / 2);
  let rowIter = 0;

  let incrementedRow = false;
  let j = radius;
  let prevSum;
  // snakewise pass
  for (let i = radius; i < rows - radius; i += INCREMENT) {
    // handle first case
    if (highDensityRegions.length == 0) {
      const sum = getSumFirstRegion(regionSize, entry);
      highDensityRegions.push({
        sum,
        idx: radius * columns + radius,
      });
      prevSum = sum;
      j += INCREMENT;
    }

    let sum;

    if (rowIter % 2 == 0) {
      for (; j < columns - radius; j += INCREMENT) {
        if (incrementedRow) {
          incrementedRow = false;
          sum = getSumSnakewiseTurnRegion(regionSize, entry, prevSum, i, j);
        } else {
          sum = getSumSnakewiseIterateRegionRight(radius, entry, prevSum, i, j);
        }
        highDensityRegions.push({ sum, idx: i * columns + j });
        prevSum = sum;
      }
      j -= INCREMENT;
    } else {
      for (; j >= radius; j -= INCREMENT) {
        if (incrementedRow) {
          incrementedRow = false;
          sum = getSumSnakewiseTurnRegion(regionSize, entry, prevSum, i, j);
        } else {
          sum = getSumSnakewiseIterateRegionLeft(radius, entry, prevSum, i, j);
        }
        highDensityRegions.push({ sum, idx: i * columns + j });
        prevSum = sum;
      }
      j += INCREMENT;
    }

    incrementedRow = true;
    rowIter++;
  }

  // sort and filter by sum then index
  highDensityRegions.sort((a, b) => {
    return b.sum - a.sum;
  });

  entry.highDensityRegions = { data: highDensityRegions };
  return entry;
};

const getHighDensityRegionsAllBoards = (boards) => {
  const allBoardsHighDensityRegions = boards.map((entry) => {
    return entry.ready ? getHighDensityRegions(entry) : entry;
  });

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
  const postURL =
    process.env.NODE_ENV == "production"
      ? `https://${process.env.NEXT_PUBLIC_URL}/admin`
      : `http://${process.env.NEXT_PUBLIC_URL}/admin`;

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
  const url =
    process.env.NODE_ENV == "production"
      ? `https://${process.env.NEXT_PUBLIC_URL}/boards`
      : `http://${process.env.NEXT_PUBLIC_URL}/boards`;

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
  }, 2500);
  return res.data;
}

module.exports = {
  broadcast,
  updateBoardWithIncremented,
  getHighDensityRegions,
};
