import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import React, { useRef } from "react";

interface Props {
  open: boolean;
  handleClose: () => void;
  handleShare: ((emails: string[]) => Promise<void>) | undefined;
}

const ShareDialog = ({ open, handleClose, handleShare }: Props) => {
  const emailsRef = useRef<HTMLInputElement>();

  const handleSubmit = () => {
    const emails = emailsRef.current?.value?.split(",");
    if (emails !== undefined) {
      handleShare?.(emails);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Share this board with</DialogTitle>
      <DialogContent>
        <p>Enter emails as comma separated values</p>
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleSubmit();
            handleClose();
          }}
        >
          <TextField
            inputRef={emailsRef}
            autoFocus
            margin="dense"
            id="emails"
            type="text"
            fullWidth
            variant="standard"
          />
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" type="submit">
              Share
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
