import React, { useEffect } from "react";
import axios from "axios";
import BoardGraphics from "./pixi/BoardGraphics";

const BoardsContainer = ({ data, fetchData, ws }) => {
  function updateAndSendData() {
    data.forEach((entry) => {
      const { board, id } = entry;
      const port = 5431;
      const url = `http://localhost:${port}/boards/${id}`;

      axios.post(url, { board }).then((res) => {
        console.log(res);
      });
    });
    fetchData();
  }

  useEffect(() => {
    if (ws.data) {
      const { message } = ws.data;
      if (typeof message === "object") {
        updateAndSendData();
      }
    }
  }, [ws.data]);

  return (
    <>
      {data.map((entry) => (
        <BoardGraphics data={entry} />
      ))}
    </>
  );
};

export default BoardsContainer;
