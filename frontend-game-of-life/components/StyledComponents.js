import { styled } from "@mui/material/styles";
import { Button, Box } from "@mui/material";

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.contrastText,
  color: theme.palette.primary.main,
  border: `3px solid ${theme.palette.primary.main}`,
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    border: `3px solid ${theme.palette.primary.main}`,
  },
  borderRadius: 0,
  padding: theme.spacing(0.5),
}));

const TextButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.main,
  backgroundColor: "transparent",
  "&:hover": {
    backgroundColor: "transparent",
    color: theme.palette.secondary.contrastText,
  },
  "&:active": {
    disableRipple: true,
  },
  padding: theme.spacing(0.5),
}));

const BorderBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "center",
})(({ center, theme }) => ({
  backgroundColor: "transparent",
  border: `3px solid ${theme.palette.secondary.main}`,
  borderTop: "0px",
  padding: theme.spacing(1),

  ...(center && {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    width: "100vw",
    alignItems: "center",
    justifyContent: "center",
  }),
}));

module.exports = {
  PrimaryButton,
  TextButton,
  BorderBox,
};
