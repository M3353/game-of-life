const about = [
  {
    title: "",
    content:
      "the yale game of life is a web art project that the public contributes to. \
    it demonstrates how complexity can arise from simplicity and order can originate from chaos. \
    while the projected image may appear random, they are created through a determinstic algrithm-Conway's game of life. \
    Conway's game of life starts from an initial grid of dead and alive cells, and its evolution can be observed without any further input \
    Each cell interacts with its 8 neighbors, and depending on their states, will die or stay alive in the next iteration \
    the piece is an interrogation of free will, chance, cause and effect",
  },
  {
    title: "",
    content:
      "the public contributes to the work by providing three pieces of data: a small pixel drawing, the location on the board they would like to place their drawing, and an image. \
    a game of life board will be filled with the drawn entry at the selected location. \
    several image preprocessing events alter the submitted image, and the results are projected onto the board",
  },
  {
    title: "development",
    content:
      "the development process of the yale game of life deviated far from my practice. traditionally I \
    make many adjustments as I work, developing the concept as the piece takes form. i play around with meaning and purpose and iterate through many compositions, concepts and colors. \
    furthermore, i am a representational painter - though i work with abstraction, most of my work resembles something. \
    the yale game of life, in contrast, is an entirely conceptual, abstract piece. \
    there were no visuals until the entire game of life came togehter, making it very difficult to experiment \
    i grapple with finding meaning in my work, and whereas in a traditional piece I can mask the struggle with paint application, technique, and other principles, i battled \
    immensely ascribing purpose to the yale game of art. i found this wasn't entirely bad. though experimentation was minimal, once I developed the visuals, I could tweak parameters, colors and shapes. \
    for example, once the grid became to obsucre to properly represent a game of life board, I introduced other shapes to represent the areas of high and low density values.\
    as time went on, I developed absolute conviction in my concept. ",
  },
  {
    title: "technical implementation",
    content:
      "the yale game of art is a monorepo created using a postgresql database hosted by supabase, a node/express server, and a nextjs/react frontend. the visuals \
    are rendered using pixijs and the site is hosted on heroku.",
  },
  {
    title: "",
    content:
      "the workflow for user submission is handled as follows. upon navigating to the submit page, the user fills out an entry, a location and submits an image \
      the 5x5 pixel drawing entry is saved as an array, the location is set to an x, y coordinate pair, and the image is saved to an amazon s3 bucket that correponds with the selected board. \
      the array, location and image key (name) are sent in a post request to the backend server for further processing",
  },
  {
    title: "",
    content:
      "in middleware, before the server endpoint is evoked, the image is fetched from the s3 bucket, and a python script removes its background using a machine learning model. \
      then the image is blurred, its saturation is increased, and gets converted to raw pixel data. using a k means clustering algorithm with naive sharding, i calculated the \
      five most common colors in the submitted image, save it, and match all pixels to their closest color in lab color space. the image is then converted into png \
      and reuploaded onto the amazon s3 bucket",
  },
  {
    title: "",
    content:
      "then, the entry is placed into the specified location of the specified board. the updated board, occupied locations and palette are saved to supabase \
      once the occupied board is completely filled, the ready code is toggled, and the game of life starts running",
  },
  {
    title: "",
    content:
      "the workflow for running the game of life is as follow. a websocket exchanges data between the server and client, triggering the game of life's animated board. \
      on every message, each board is incremented using the game of life algorithm. if the next iteration of the board is calculated as the dead state (all cells are dead) \
      the board is not updated. in other words, the board is preserved in its penultimate state. the incremented data is passed to a function that ranks the board's high density regions-\
      areas on the board with the highest cumulative value. if the board is in the penultimate state, the high density regions will also not be updated",
  },
  {
    title: "",
    content:
      "client side data is updated with the incremented boards once it receives the broadcasted message. each board consists of five components: the game of life grid, the \
      inputed images, and 3/4 circles, circles and squares. the primitve shapes are rendered on the ares of low, high and all densities respectively. their colors are determined by \
      their location and the palette calculated with the k-clustering algorithm. the images are rendered as translucent sprites \
      anchored to the ares of high density, and the game of life grid serves as the background. the cell's base colors is determined by their location on the board, and the palette calculated by the \
      k clustering algorithm. cell colors are normalized by interpolating their value - the number of iterations it has stayed alive - with the boards maximum value. ",
  },
  {
    title: "moving forward",
    content:
      "as in life, the game of life demonstrates the complexity can arise from simplicty, order from chaos, and that all of these things are predetermined. as with all code, all algorithms \
      used are deterministic. nothing in the boards occur from random chance. moving forward, i hope to capture more of the complexity, order and beauty of life in the boards, by introducing \
      more elements to the piece.",
  },
];

const aboutImages = [
  {
    img: "/1.png",
    caption: "the first working image produced by the yale game of life",
  },
  {
    img: "/2.png",
    caption: "",
  },
  {
    img: "/3.png",
    caption: "",
  },
  {
    img: "/4.png",
    caption: "",
  },
  {
    img: "/5.png",
    caption: "",
  },
];

const instructions = {
  entry: "draw something inside the square",
  occupied: "select one of the regions below",
  image:
    "upload an image (please note all images will be displayed publically)",
};

module.exports = {
  about,
  aboutImages,
  instructions,
};
