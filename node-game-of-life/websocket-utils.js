const axios = require("axios");

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

async function broadcast(clients) {
  const url = "http://localhost:5431/boards";
  await waitInterval(async function () {
    const res = await axios.get(url);
    const data = JSON.stringify(res.data);
    for (let c of clients.values()) {
      c.send(data);
    }
  }, 1000);
  return interval;
}

module.exports = {
  broadcast,
};
