const {
  initializeCentroidsNaiveSharding,
  clusterDataPoints,
  getNewCentroids,
  hasConverged,
  labToRgb,
} = require("./filters_utils");

const MAX_ITERATIONS = 32;

function kMean(data, info, k) {
  let centroids = initializeCentroidsNaiveSharding(data, info, k);

  let clusters;

  let converged = false;
  const maxIterations = MAX_ITERATIONS;
  let iterations = 0;

  console.log("------ running kMeans ------");

  while (!converged && iterations < maxIterations) {
    iterations++;
    const oldCentroids = [...centroids];

    clusters = clusterDataPoints(data, info, centroids);
    centroids = getNewCentroids(data, info, clusters);

    converged = hasConverged(oldCentroids, centroids);
  }

  console.log(
    `------ finished running kMeans in ${iterations} iterations------`
  );

  return clusters;
}

async function labArrayToRgb(array, increment) {
  let rgbArray = [];
  for (let i = 0; i < array.length; i += increment) {
    let c = 0;
    const lab = [];
    while (c < increment) {
      lab.push(array[i + c]);
      c++;
    }
    const rgb = labToRgb(lab);

    c = 0;
    while (c < increment) {
      if (c < rgb.length) rgbArray.push(parseInt(rgb[c]));
      else rgbArray.push(array[i + c]);
      c++;
    }
  }

  return new Uint8ClampedArray(rgbArray);
}

module.exports = {
  kMean,
  labArrayToRgb,
};
