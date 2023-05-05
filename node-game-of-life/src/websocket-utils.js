require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const axios = require("axios");
const { ENTRY_SIZE } = require("./data");

const inBoard = (x, y, nr, nc) => {
  return x >= 0 && y >= 0 && x < nc && y < nr;
};

const incrementBoardHelper = (entry) => {
  const {
    board,
    rows,
    columns,
    name,
    id,
    occupied,
    ready,
    highDensityRegions,
  } = entry;

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

    sum += ele;
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

const getSumSnakewiseTurnRegion = (
  regionSize,
  entry,
  increment,
  prevSum,
  i
) => {
  const { board, columns } = entry;
  const radius = parseInt(regionSize / 2);
  let sum = prevSum;
  let start = i % 2 == 0 ? 0 : columns - regionSize;
  const end = start + regionSize;
  for (let k = start; k < end; k++) {
    for (let l = 0; l <= radius; l++) {
      const topIdx = (i - increment - l) * columns + k;
      const bottomIdx = (i + l) * columns + k;
      sum -= board.data[topIdx];
      sum += board.data[bottomIdx];
    }
  }
  return sum;
};

const getSumSnakewiseIterateRegion = (
  radius,
  entry,
  increment,
  prevSum,
  i,
  j
) => {
  const { board, columns } = entry;
  let sum = prevSum;
  for (let k = -radius; k < radius; k++) {
    for (let l = 0; l <= radius; l++) {
      const leftIdx = (i + k) * columns + (j - increment - l);
      const rightIdx = (i + k) * columns + (j + l);
      sum = i % 2 === 0 ? sum - board.data[leftIdx] : sum + board.data[leftIdx];
      sum =
        i % 2 === 0 ? sum + board.data[rightIdx] : sum - board.data[rightIdx];
    }
  }
  return sum;
};

const getHighDensityRegions = (entry) => {
  const { board, rows, columns, name, id, occupied, ready } = entry;
  let highDensityRegions = [];

  const regionSize = ENTRY_SIZE;
  const radius = parseInt(regionSize / 2);
  const increment = 2;

  let incrementedRow = false;
  // snakewise pass
  for (let i = radius; i < rows - radius; i += increment) {
    // handle first case
    let j = radius;
    if (highDensityRegions.length == 0) {
      const sum = getSumFirstRegion(regionSize, entry);
      highDensityRegions.push({
        sum,
        idx: radius * columns + radius,
      });
      j += increment;
    }

    let prevSum = highDensityRegions[highDensityRegions.length - 1].sum;
    let sum;

    if (i % 2 == 0) {
      for (; j < columns - radius; j += increment) {
        if (incrementedRow) {
          incrementedRow = false;
          sum = getSumSnakewiseTurnRegion(
            regionSize,
            entry,
            increment,
            prevSum,
            i
          );
        } else {
          sum = getSumSnakewiseIterateRegion(
            radius,
            entry,
            increment,
            prevSum,
            i,
            j
          );
        }
        highDensityRegions.push({ sum, idx: i * columns + j });
      }
    } else {
      for (let j = columns - radius; j >= radius; j -= increment) {
        if (incrementedRow) {
          incrementedRow = false;
          sum = getSumSnakewiseTurnRegion(
            regionSize,
            entry,
            increment,
            prevSum,
            i
          );
        } else {
          sum = getSumSnakewiseIterateRegion(
            radius,
            entry,
            increment,
            prevSum,
            i,
            j
          );
        }
        highDensityRegions.push({ sum, idx: i * columns + j });
      }
    }

    incrementedRow = true;
  }

  // sort and filter by sum then index
  highDensityRegions.sort((a, b) => {
    return b.sum - a.sum;
  });
  if (highDensityRegions.length > occupied.data.length) {
    highDensityRegions.splice(occupied.data.length);
  }

  entry.highDensityRegions = { data: highDensityRegions };
  return entry;
};

const getHighDensityRegionsAllBoards = (boards) => {
  const allBoardsHighDensityRegions = boards.map((entry) => {
    return entry.ready && !entry.finished
      ? getHighDensityRegions(entry)
      : entry;
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
  }, 2500);
  return res.data;
}

module.exports = {
  broadcast,
  updateBoardWithIncremented,
  getHighDensityRegions,
};
