const RGBMAX = 255;

function normalize(val, minFrom, maxFrom, minTo) {
  return ((val - minFrom) / (maxFrom - minFrom)) * (RGBMAX - minTo) + minTo;
}

function valueToHex(val) {
  return (val & 0x00ffffff).toString(16);
}

function rgbToHex(r, g, b) {
  return valueToHex(r) + valueToHex(g) + valueToHex(b);
}

function toColor(val, maxFrom, minFrom, palette) {
  const { r, g, b } = palette;
  const normalized = normalize(val, minFrom, maxFrom, r);
  const hexColor = rgbToHex(normalized, g, b);
  return "0x" + hexColor.padStart(6, "0");
}

module.exports = { toColor };
