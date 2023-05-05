const {
  initializeCentroidsNaiveSharding,
  clusterDataPoints,
  getNewCentroids,
  hasConverged,
} = require("./filters-utils");

const MAX_ITERATIONS = 32;

function kMean(data, info, k) {
  let centroids = initializeCentroidsNaiveSharding(data, info, k);

  let clusters;

  let converged = false;
  const maxIterations = MAX_ITERATIONS;
  let iterations = 0;

  while (!converged && iterations < maxIterations) {
    iterations++;
    const oldCentroids = [...centroids];

    clusters = clusterDataPoints(data, info, centroids);
    centroids = getNewCentroids(data, info, clusters);

    converged = hasConverged(oldCentroids, centroids);
  }

  return clusters;
}

module.exports = {
  kMean,
};
