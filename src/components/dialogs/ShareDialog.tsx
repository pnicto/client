import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import React, { useRef, useState } from "react";

interface Props {
  open: boolean;
  handleClose: () => void;
  handleShare: ((emails: string[]) => Promise<void>) | undefined;
  userMails: { email: string; username: string; id: number }[];
}

const ShareDialog = ({ open, handleClose, handleShare, userMails }: Props) => {
  let emailsList: string[] = [];
  userMails.forEach((user) => {
    emailsList.push(user.email);
  });
  const [emails, setEmails] = useState(emailsList);

  const emailsRef = useRef<HTMLInputElement>();

  const handleSubmit = () => {
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
            value={emails.join(",")}
            onChange={(event) => {
              setEmails(event.target.value.split(","));
            }}
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
