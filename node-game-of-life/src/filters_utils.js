// picking color palettes with k color
// https://medium.com/geekculture/implementing-k-means-clustering-from-scratch-in-javascript-13d71fbcb31e

const EPS = 0.01;

function labToRgb(lab) {
  var y = (lab[0] + 16) / 116,
    x = lab[1] / 500 + y,
    z = y - lab[2] / 200,
    r,
    g,
    b;

  x = 0.95047 * (x * x * x > 0.008856 ? x * x * x : (x - 16 / 116) / 7.787);
  y = 1.0 * (y * y * y > 0.008856 ? y * y * y : (y - 16 / 116) / 7.787);
  z = 1.08883 * (z * z * z > 0.008856 ? z * z * z : (z - 16 / 116) / 7.787);

  r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  b = x * 0.0557 + y * -0.204 + z * 1.057;

  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

  return [
    Math.max(0, Math.min(1, r)) * 255,
    Math.max(0, Math.min(1, g)) * 255,
    Math.max(0, Math.min(1, b)) * 255,
  ];
}

function rgbToLab(rgb) {
  var r = rgb[0] / 255,
    g = rgb[1] / 255,
    b = rgb[2] / 255,
    x,
    y,
    z;

  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}
function labDistance(l1, l2) {
  const deltaL = l1.l - l2.l;
  const deltaA = l1.a - l2.a;
  const deltaB = l1.b - l2.b;
  const c1 = Math.sqrt(l1.a * l1.a + l1.b * l1.b);
  const c2 = Math.sqrt(l2.a * l2.a + l2.b * l2.b);
  const deltaC = c1 - c2;
  let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
  deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
  const sc = 1.0 + 0.045 * c1;
  const sh = 1.0 + 0.015 * c1;
  const deltaLKlsl = deltaL / 1.0;
  const deltaCkcsc = deltaC / sc;
  const deltaHkhsh = deltaH / sh;
  const i =
    deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;

  // save time by using squared distance
  return i < 0 ? 0 : i;
}

function getMeanPixel(points, data) {
  let n = points.length;
  const avgPixel = {
    l: 0,
    a: 0,
    b: 0,
  };

  points.forEach((point) => {
    const l = data[point];
    const a = data[point + 1];
    const b = data[point + 2];

    if (l <= EPS && a <= EPS && b <= EPS) {
      n--;
    } else {
      avgPixel.l += l;
      avgPixel.a += a;
      avgPixel.b += b;
    }
  });

  avgPixel.l = n == 0 ? 0 : avgPixel.l / n;
  avgPixel.a = n == 0 ? 0 : avgPixel.a / n;
  avgPixel.b = n == 0 ? 0 : avgPixel.b / n;

  return avgPixel;
}

function hasConverged(oldCentroids, centroids) {
  if (!oldCentroids || !oldCentroids.length) {
    return false;
  }
  for (let i = 0; i < centroids.length; i++) {
    if (
      oldCentroids[i].l !== centroids[i].l ||
      oldCentroids[i].a !== centroids[i].a ||
      oldCentroids[i].b !== centroids[i].b
    ) {
      return false;
    }
  }
  return true;
}

function roundTo(num, multiple) {
  return num - (num % multiple);
}

function calcMeanCentroid(data, info, start, end) {
  let n = (end - start) / info.channels;
  const avgPixel = { l: 0, a: 0, b: 0 };
  for (let i = start; i < end; i += info.channels) {
    const l = data[i];
    const a = data[i + 1];
    const b = data[i + 2];

    if (l <= EPS && a <= EPS && b <= EPS) {
      n--;
    } else {
      avgPixel.l += l;
      avgPixel.a += a;
      avgPixel.b += b;
    }
  }

  avgPixel.l = n == 0 ? 0 : avgPixel.l / n;
  avgPixel.a = n == 0 ? 0 : avgPixel.a / n;
  avgPixel.b = n == 0 ? 0 : avgPixel.b / n;

  return avgPixel;
}

function initializeCentroidsNaiveSharding(data, info, k) {
  // implementation of a variation of naive sharding centroid initialization method
  // (not using sums or sorting, just dividing into k shards and calc mean)
  // https://www.kdnuggets.com/2017/03/naive-sharding-centroid-initialization-method.html

  const numSamples = data.length;
  // Divide dataset into k shards:
  const step = roundTo(Math.floor(numSamples / k), info.channels);

  const centroids = [];
  for (let i = 0; i < k; i++) {
    const start = step * i;
    let end = step * (i + 1);
    if (i + 1 === k) {
      end = numSamples;
    }
    centroids.push(calcMeanCentroid(data, info, start, end));
  }
  return centroids;
}

function initializeCentroids(data, info, k) {
  const { channels } = info;
  const centroids = [];

  const idxSet = new Set();

  while (centroids.length < k) {
    const idx = channels * Math.floor((Math.random() * data.length) / channels);

    if (!idxSet.has(idx)) {
      idxSet.add(idx);
      const pixel = {
        l: data[idx],
        a: data[idx + 1],
        b: data[idx + 2],
      };

      centroids.push(pixel);
    }
  }

  return centroids;
}

function clusterDataPoints(data, info, centroids) {
  const { channels } = info;
  const clusters = [];
  for (let c = 0; c < centroids.length; c++) {
    clusters[c] = {
      points: [],
      centroid: centroids[c],
    };
  }

  for (let i = 0; i < data.length; i += channels) {
    const pixel = {
      l: data[i],
      a: data[i + 1],
      b: data[i + 2],
    };

    let closestCentroid = centroids[0],
      closestCentroidIndex = 0;

    centroids.forEach((centroid, idx) => {
      if (labDistance(pixel, centroid) < labDistance(pixel, closestCentroid)) {
        closestCentroid = centroid;
        closestCentroidIndex = idx;
      }
    });
    clusters[closestCentroidIndex].points.push(i);
  }

  return clusters;
}

function getNewCentroids(data, info, clusters) {
  const centroids = [];
  let centroid;
  clusters.forEach((cluster) => {
    const { points } = cluster;
    if (points.length > 0) {
      centroid = getMeanPixel(points, data);
    } else {
      centroid = initializeCentroids(data, info, 1)[0];
    }
    centroids.push(centroid);
  });

  return centroids;
}

module.exports = {
  getNewCentroids,
  clusterDataPoints,
  initializeCentroids,
  initializeCentroidsNaiveSharding,
  hasConverged,
  labToRgb,
  rgbToLab,
};
