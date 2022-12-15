import React from "react";

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
