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
  handleSubmit: (() => Promise<void>) | (() => void);
}

const AddDialog = ({
  open, // Dialog state
  handleClose, // Func to handle close
  fieldRef, // Ref for the dialog name
  handleSubmit,
  dialogTitle, // Dialog title
  dialogLabel, // Dialog name
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
            Add/Rename
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddDialog;
