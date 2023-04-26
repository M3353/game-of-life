import { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";

import SubmitContainer from "../components/SubmitContainer";
import { useGameContext } from "../src/GameContext";

export default function UserSubmitPage() {
  const [data, setData] = useState(null);
  const { isMobile } = useGameContext();

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    const url =
      process.env.NODE_ENV == "development"
        ? isMobile
          ? process.env.NEXT_PUBLIC_MOBILE_URL
          : process.env.NEXT_PUBLIC_URL
        : process.env.NEXT_PUBLIC_URL;

    const endpoint = `${url}/boards/`;
    axios
      .get(endpoint)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Box>
      {data != null && <SubmitContainer data={data} fetchData={fetchData} />}
    </Box>
  );
}
