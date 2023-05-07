const express = require("express");
const bodyParser = require("body-parser");
const ws = require("ws");
const cors = require("cors");
const compression = require("compression");

const queries = require("./src/queries");
const {
  createValidBoard,
  updateBoardWithUserEntry,
  updateBoardWithUserImage,
  emptyS3Directory,
  removeBackgroundFromUserImage,
} = require("./src/middleware");
const { broadcast } = require("./src/websocket-utils");
const app = express();
const port = process.env.PORT || 5431;

function setupWebsocket(server) {
  const wsServer = new ws.Server({ noServer: true });

  broadcast(wsServer.clients);

  server.on("upgrade", (req, socket, head) => {
    wsServer.handleUpgrade(req, socket, head, (socket) => {
      wsServer.emit("connection", socket, req);
    });
  });

  wsServer.on("connection", (socket) => {
    socket.on("message", (message) => {
      console.log(message);
    });

    socket.send("connection established");
  });
}

// middleware
app.options("*", cors());
app.use(cors({ allowedHeaders: "Content-Type" }));

app.use(compression());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// test query
app.get("/", (req, res) => {
  res.json({ info: "Node.js, Express, and Postgres API" });
});

// queries
app.get("/boards", queries.getBoards);
app.get("/boards/:id", queries.getBoardById);
app.put(
  "/boards/:id",
  // removeBackgroundFromUserImage,
  updateBoardWithUserImage,
  updateBoardWithUserEntry,
  queries.updateBoard
);

app.post("/admin", queries.incrementBoard);
app.post("/admin/:id", createValidBoard, queries.createBoard);
app.delete("/admin/:id", emptyS3Directory, queries.deleteBoard);

const server = app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

setupWebsocket(server);

module.exports = app;
