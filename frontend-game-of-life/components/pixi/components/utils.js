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
  const r = palette[0];
  const g = palette[1];
  const b = palette[2];
  const _r = normalize(val, minFrom, maxFrom, r);
  const _g = normalize(val, minFrom, maxFrom, g);
  const _b = normalize(val, minFrom, maxFrom, b);
  const hexColor = rgbToHex(_r, _g, _b);
  return "0x" + hexColor.padStart(6, "0");
}

function toInvertedColor(palette) {
  const r = 255 - palette[0];
  const g = 255 - palette[1];
  const b = 255 - palette[2];
  const hexColor = rgbToHex(r, g, b);
  return "0x" + hexColor.padStart(6, "0");
}

module.exports = { toColor, toInvertedColor };
