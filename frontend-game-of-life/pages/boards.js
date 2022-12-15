import React, { useState, useEffect } from "react";
import axios from "axios";

import useWebSocket from "../src/useWebSocket";
import BoardsContainer from "../components/BoardsContainer";
import { Box } from "@mui/system";

export default function Boards() {
  const [data, setData] = useState(null);
  const ws = useWebSocket({
    socketUrl: "ws://localhost:5431",
  });

  function fetchData() {
    const port = 5431;
    const url = `http://localhost:${port}/boards`;
    axios.get(url).then((res) => {
      setData(res.data);
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (ws.data) {
      const { message } = ws.data;
      if (typeof message === "object") {
        setData(data);
      }
    }
  }, [ws.data]);

  return (
    <Box>
      {data != null && (
        <BoardsContainer data={data} fetchData={fetchData} ws={ws} />
      )}
    </Box>
  );
}
