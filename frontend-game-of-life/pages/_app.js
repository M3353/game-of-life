import React from "react";

import { ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";

import { GameProvider } from "../src/GameContext";
import { SessionProvider } from "next-auth/react";
import { GameOfLifeTheme } from "../styles/themes";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <GameProvider>
      <SessionProvider session={session}>
        <ThemeProvider theme={GameOfLifeTheme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </SessionProvider>
    </GameProvider>
  );
}

export default MyApp;
