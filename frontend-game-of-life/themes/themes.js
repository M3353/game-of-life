import { createTheme } from "@mui/material/styles";
// import { Cairo } from "@next/font/google";

// export const cairo = Cairo({
//   weight: ["400", "500", "700"],
//   display: "swap",
//   fallback: ["Helvetica", "Arial", "sans-serif"],
// });

const GameOfLifeTheme = createTheme({
  palette: {
    primary: {
      main: "#f77055",
      contrastText: "white",
    },
  },
  // typography: {
  //   fontFamily: cairo.style.fontFamily,
  // },
});

module.exports = {
  GameOfLifeTheme,
};
