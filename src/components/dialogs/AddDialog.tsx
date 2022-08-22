import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import React from "react";

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
      <form
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <DialogContent>
          <TextField
            autoFocus={true}
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
          <Button variant="contained" type="submit">
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddDialog;
