import React, { useState, useEffect } from "react";
import axios from "axios";

import useWebSocket from "../src/useWebSocket";
import BoardsContainer from "../components/BoardsContainer";
import { Box } from "@mui/system";

export default function Boards() {
  const [data, setData] = useState([]);
  const [mounted, setMounted] = useState(false);
  const url = process.env.NEXT_PUBLIC_URL;
  const ws = useWebSocket({
    socketUrl:
      process.env.NODE_ENV == "production"
        ? `ws://${process.env.NEXT_PUBLIC_URL.replace("https://", "")}`
        : `ws://${process.env.NEXT_PUBLIC_URL.replace("http://", "")}`,
  });

  function fetchData() {
    const endpoint = `${url}/boards`;
    axios
      .get(endpoint)
      .then((res) => {
        const newData = [...res.data];
        setData(newData);
      })
      .catch((err) => console.error(`Error: ${err}`));
  }

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  return (
    <Box>
      {data != null && mounted && (
        <BoardsContainer data={data} fetchData={fetchData} ws={ws} />
      )}
    </Box>
  );
}
