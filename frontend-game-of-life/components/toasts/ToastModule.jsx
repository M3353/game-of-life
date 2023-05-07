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
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={open}
      onClose={handleClose}
      autoHideDuration={6000}
    >
      <Alert severity={severity} onClose={handleClose} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

module.exports = { Toast };
