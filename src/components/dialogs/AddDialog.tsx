import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

interface Props {
  dialogTitle: string;
  dialogLabel: string;
  open: boolean;
  handleClose: () => void;
  fieldRef: React.MutableRefObject<HTMLInputElement | undefined>;
  handleSubmit: () => Promise<void>;
}

const AddDialog = ({
  open,
  handleClose,
  fieldRef,
  handleSubmit,
  dialogTitle,
  dialogLabel,
}: Props) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label={dialogLabel}
          type="text"
          fullWidth
          variant="standard"
          inputRef={fieldRef}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDialog;
