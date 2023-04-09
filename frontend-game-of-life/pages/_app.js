import React from "react";

import Footer from "../components/Footer";
import { GameProvider } from "../src/GameContext";
import { Box } from "@mui/system";

function MyApp({ Component, pageProps }) {
  return (
    <GameProvider>
      <Box>
        <Component {...pageProps} />
        <Footer />
      </Box>
    </GameProvider>
  );
}

export default MyApp;
