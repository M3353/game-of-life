import React from "react";
import { Button, Box, Typography } from "@mui/material";

import Header from "../containers/Header";
import { BorderBox } from "../components/StyledComponents";
import { about } from "../src/text";

export default function About() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <div style={{ position: "sticky", top: 0 }}>
        <Header />
      </div>
      <BorderBox>
        <Box
          sx={{
            width: "40%",
          }}
        >
          {about.map((text, i) => (
            <Typography key={i} variant="body1" sx={{ m: 2 }}>
              {text}
            </Typography>
          ))}
        </Box>
      </BorderBox>
    </Box>
  );
}
