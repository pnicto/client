import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

interface Props {
  open: boolean;
  handleClose: () => void;
  handleShare: ((emails: string[]) => Promise<void>) | undefined;
  sharedUsers?: number[];
}

const ShareDialog = ({
  open,
  handleClose,
  handleShare,
  sharedUsers,
}: Props) => {
  const [userMails, setUserMails] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const getResponse: { email: string; username: string; id: number }[] = (
        await axios.get(`${process.env.REACT_APP_API_URL}/users`)
      ).data.users;

      const users = getResponse.filter((item) => {
        return sharedUsers?.includes(item.id);
      });

      const emailsList: string[] = [];

      users.forEach((user) => {
        emailsList.push(user.email);
      });

      setUserMails(emailsList);
    };

    fetchUsers();
  }, [sharedUsers]);

  const emailsRef = useRef<HTMLInputElement>();

  const handleSubmit = () => {
    if (userMails !== undefined) {
      handleShare?.(userMails);
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
            value={userMails.join(",")}
            onChange={(event) => {
              if (event.target.value === "") {
                setUserMails([]);
              } else setUserMails(event.target.value.split(","));
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
