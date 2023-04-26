import React, { useState } from "react";
import { Toast } from "./ToastModule";

function withErrorBoundary(WrappedComponent) {
  return function ErrorBoundary(props) {
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);

    if (error) {
      return (
        <Toast
          message={`An error occurred: ${error.toString()}`}
          open={open}
          setOpen={setOpen}
          severity="error"
        />
      );
    }

    try {
      return <WrappedComponent {...props} />;
    } catch (err) {
      setError(err);
    }
  };
}

export default withErrorBoundary;
