import { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";

import SubmitContainer from "../components/SubmitContainer";

export default function UserSubmitPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    const url = process.env.NEXT_PUBLIC_VERCEL_URL;
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
