import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

interface Props {
  dialogTitle: string;
  open: boolean;
  handleClose: () => void;
  handleAlert: () => Promise<void>;
}
const AlertDialog = ({
  open,
  handleClose,
  handleAlert,
  dialogTitle,
}: Props) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
      <DialogActions>
        <Button onClick={handleClose} variant="text">
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleClose();
            handleAlert();
          }}
          variant="outlined"
          color="error"
          autoFocus
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
