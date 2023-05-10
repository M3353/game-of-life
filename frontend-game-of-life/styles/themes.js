import { createTheme } from "@mui/material/styles";
import { Josefin_Sans, Playfair_Display } from "next/font/google";
import { highlight, primary, background, disabled } from "./colors";

const josefinSans = Josefin_Sans({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "600"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["cyrillic", "latin", "latin-ext", "vietnamese"],
  weight: ["500", "700"],
  display: "swap",
  fallback: ["serif"],
});

const GameOfLifeTheme = createTheme({
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
  palette: {
    background: {
      default: background,
    },
    primary: {
      main: highlight,
      contrastText: background,
    },
    secondary: {
      main: primary,
      contrastText: highlight,
    },
  },
  typography: {
    root: {
      fontFamily: josefinSans.style.fontFamily,
      fontWeight: 500,
    },
    h3: {
      fontFamily: playfairDisplay.style.fontFamily,
      fontWeight: 700,
    },
    h6: {
      fontFamily: josefinSans.style.fontFamily,
      fontWeight: 600,
    },
    body1: {
      fontFamily: josefinSans.style.fontFamily,
      fontWeight: 400,
    },
    body2: {
      fontFamily: josefinSans.style.fontFamily,
      fontWeight: 400,
    },
  },
});

module.exports = {
  GameOfLifeTheme,
};
