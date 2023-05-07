import React from "react";
import { Box, Typography, Container } from "@mui/material";

import Header from "../containers/Header";
import { BorderBox } from "../components/StyledComponents";
import { about, aboutImages } from "../src/text";
import { useGameContext } from "../src/GameContext";

export default function About() {
  const { isMobile } = useGameContext();
  const contentSx = {
    width: "90vw",
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    justifyContent: "center",
    alignItems: "space-between",
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <div style={{ position: "sticky", top: 0 }}>
        <Header />
      </div>
      <BorderBox>
        <Typography variant="h3" sx={{ m: 4 }}>
          About
        </Typography>
        <Box sx={contentSx}>
          <Container item>
            {about.map((body, i) => (
              <Container key={i}>
                {body.title !== "" && (
                  <Typography variant="h6" sx={{ m: 2 }}>
                    {body.title}
                  </Typography>
                )}
                <Typography variant="body1" sx={{ m: 2 }}>
                  {body.content}
                </Typography>
              </Container>
            ))}
          </Container>
          <Container item>
            {aboutImages.map((body, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={body.img}
                  width="90%"
                  height="auto"
                  style={{ margin: 2 }}
                />
                {body.caption !== "" && (
                  <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                    {body.caption}
                  </Typography>
                )}
              </Box>
            ))}
          </Container>
        </Box>
      </BorderBox>
    </Box>
  );
}
