import { Snackbar, Alert } from "@mui/material";

const Toast = (props) => {
  const { message, open, setOpen, severity } = props;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      vertical="bottom"
      horizonal="right"
      onClose={handleClose}
      autoHideDuration={6000}
    >
      <Alert severity={severity} onClose={handleClose} sx={{ width: ".4vw" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
