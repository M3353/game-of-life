import { ThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import React from "react";
import { linkTheme } from "../src/links";

import Footer from "../components/Footer";
import { Box } from "@mui/system";

function MyApp({ Component, pageProps }) {
  return (
    <Box>
      <Component {...pageProps} />
      <Footer />
    </Box>
  );
}

export default MyApp;
