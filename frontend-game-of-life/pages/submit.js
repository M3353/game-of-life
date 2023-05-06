import { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Typography } from "@mui/material";

import SubmitContainer from "../containers/SubmitContainer";
import { useGameContext } from "../src/GameContext";
import Header from "../containers/Header";
import Footer from "../containers/Footer";
import { BorderBox } from "../components/StyledComponents";

export default function UserSubmitPage() {
  const [data, setData] = useState();
  const { isMobile } = useGameContext();

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    const url =
      process.env.NODE_ENV == "production"
        ? `https://${process.env.NEXT_PUBLIC_URL}`
        : `http://${process.env.NEXT_PUBLIC_URL}`;

    const endpoint = `${url}/boards/`;
    axios
      .get(endpoint)
      .then((res) => {
        setData(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Grid sx={{ minheight: "100vh" }}>
      <div style={{ position: "sticky", top: 0 }}>
        <Header />
      </div>
      <BorderBox>
        {data !== undefined && data.length > 0 ? (
          <SubmitContainer data={data} fetchData={fetchData} />
        ) : (
          <Typography variant="body1"> no data :( </Typography>
        )}
      </BorderBox>
    </Grid>
  );
}
