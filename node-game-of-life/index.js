const express = require("express");
const bodyParser = require("body-parser");
const ws = require("ws");
const cors = require("cors");
const admin = require("./admin-queries");
const player = require("./player-queries");
const {
  validator,
  createValidBoard,
  updateBoardWithUserEntry,
} = require("./middleware");
const { broadcast } = require("./websocket-utils");
const app = express();
const port = 5431;

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
app.use(cors());
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
app.get("/boards", player.getBoards);
app.get("/boards/:id", player.getBoardById);
app.put(
  "/boards/:id",
  validator("entrySchema"),
  updateBoardWithUserEntry,
  player.updateBoard
);

app.post("/admin", admin.incrementBoard);
app.post(
  "/admin/:id",
  validator("boardSchema"),
  createValidBoard,
  admin.createBoard
);
app.delete("/admin/:id", admin.deleteBoard);

const server = app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

setupWebsocket(server);
