import React, { useState, useEffect } from "react";
import axios from "axios";
import BoardsContainer from "../components/BoardsContainer";
import { Box } from "@mui/system";

export default function Boards() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    const port = 5431;
    const url = `http://localhost:${port}/boards`;
    axios.get(url).then((res) => {
      console.log(res);
      setData(res.data);
    });
  }

  return (
    <Box>
      {data != null && <BoardsContainer data={data} fetchData={fetchData} />}
    </Box>
  );
}
