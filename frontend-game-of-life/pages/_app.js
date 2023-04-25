import React from "react";

import { ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/system";

import Footer from "../components/Footer";
import { GameProvider } from "../src/GameContext";
import { GameOfLifeTheme } from "../themes/themes";

function MyApp({ Component, pageProps }) {
  return (
    <GameProvider>
      <ThemeProvider theme={GameOfLifeTheme}>
        <Box>
          <Component {...pageProps} />
          <Footer />
        </Box>
      </ThemeProvider>
    </GameProvider>
  );
}

export default MyApp;
