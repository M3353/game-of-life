import React, { useState, useEffect } from "react";
import axios from "axios";

import useWebSocket from "../src/useWebSocket";
import BoardsContainer from "../components/BoardsContainer";
import { Box } from "@mui/system";

export default function Boards() {
  const [data, setData] = useState(null);
  const url = process.env.NEXT_PUBLIC_VERCEL_URL;
  const ws = useWebSocket({
    socketUrl:
      process.env.NODE_ENV == "production"
        ? `ws://${process.env.NEXT_PUBLIC_VERCEL_URL.replace("https://", "")}`
        : `ws://${process.env.NEXT_PUBLIC_VERCEL_URL.replace("http://", "")}`,
  });

  function fetchData() {
    const endpoint = `${url}/boards`;
    axios.get(endpoint).then((res) => {
      setData(res.data);
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box>
      {data != null && (
        <BoardsContainer data={data} fetchData={fetchData} ws={ws} />
      )}
    </Box>
  );
}
