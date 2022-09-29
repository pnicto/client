import { Snackbar, AlertProps } from "@mui/material";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import React from "react";
import { useGlobalContext } from "../../context/appContext";

// Alert snackbar from MUI docs
const AlertSnackbar = () => {
  const { globalDispatch, globalState } = useGlobalContext();
  const { isOpen, message, severity } = globalState.snackbarState;

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={3030}
      onClose={(_: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return;
        globalDispatch({
          type: "close snackbar",
        });
      }}
    >
      <Alert
        onClose={(_: React.SyntheticEvent | Event, reason?: string) => {
          if (reason === "clickaway") return;
          globalDispatch({
            type: "close snackbar",
          });
        }}
        severity={severity as AlertColor}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertSnackbar;
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
