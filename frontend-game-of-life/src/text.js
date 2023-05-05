const about = [
  "the yale game of life is a web art project that the public contributes to. \
    it demonstrates how complexity can arise from simplicity and order can originate from chaos. \
    while the projected image may appear random, they are created through a determinstic algrithm-Conway's game of life. \
    Conway's game of life starts from an initial grid of dead and alive cells, and its evolution can be observed without any further input \
    Each cell interacts with its 8 neighbors, and depending on their states, will die or stay alive in the next iteration \
    the piece is an interrogation of free will, chance, cause and effect",

  "the public contributes to the work by providing three pieces of data: a small pixel drawing, the location on the board they would like to place their drawing, and an image. \
    a game of life board will be filled with the drawn entry at the selected location. \
    several image preprocessing events alter the submitted image, and the results are projected onto the board",
];

const instructions = {
  entry: "draw something inside the square",
  occupied: "select one of the regions below",
  image:
    "upload an image (please note all images will be displayed publically)",
};

module.exports = {
  about,
  instructions,
};
