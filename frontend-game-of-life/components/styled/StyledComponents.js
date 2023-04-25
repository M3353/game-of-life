import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.primary.contrastText,
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
  },
  border: `1px solid ${theme.palette.primary.contrastText}`,
  borderRadius: 0,
  padding: theme.spacing(1),
}));

module.exports = {
  PrimaryButton,
};
