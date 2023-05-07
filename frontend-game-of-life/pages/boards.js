import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";

import useWebSocket from "../src/useWebSocket";
import BoardsContainer from "../containers/BoardsContainer";
import Header from "../containers/Header";
import Footer from "../containers/Footer";
import { BorderBox } from "../components/StyledComponents";
import { useGameContext } from "../src/GameContext";

export default function Boards() {
  const { galleryView } = useGameContext();
  const [data, setData] = useState([]);
  const [mounted, setMounted] = useState(false);

  const socketUrl =
    process.env.NODE_ENV == "production"
      ? `wss://${process.env.NEXT_PUBLIC_URL}`
      : `ws://${process.env.NEXT_PUBLIC_URL}`;

  const ws = useWebSocket({
    socketUrl,
  });

  const url =
    process.env.NODE_ENV == "production"
      ? `https://${process.env.NEXT_PUBLIC_URL}`
      : `http://${process.env.NEXT_PUBLIC_URL}`;

  function fetchData() {
    const endpoint = `${url}/boards`;
    axios
      .get(endpoint)
      .then((res) => {
        console.log(res.data);
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {!galleryView && (
        <div style={{ position: "sticky", top: 0 }}>
          <Header />
        </div>
      )}
      <BorderBox>
        {!galleryView && (
          <Typography variant="h3" sx={{ m: 2 }}>
            Gallery
          </Typography>
        )}
        {data != null && mounted && (
          <BoardsContainer data={data} fetchData={fetchData} ws={ws} />
        )}
      </BorderBox>
    </Box>
  );
}
