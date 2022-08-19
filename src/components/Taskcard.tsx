import { AddCircle, MoreVert } from "@mui/icons-material";
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useRef, useState } from "react";
import { TaskcardInterface } from "../interfaces/interfaces";

type Props = {
  taskcard: TaskcardInterface;
};
const Taskcard = ({ taskcard }: Props) => {
  const [open, setOpen] = useState(false);
  const taskRef = useRef<HTMLInputElement>();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddTask = async () => {
    const taskToBeAdded = taskRef.current?.value;
    const postBody = {
      taskTitle: taskToBeAdded,
    };
    if (taskToBeAdded) {
      setOpen(false);
      const url = `${process.env.REACT_APP_BASE_URL}/tasks/${taskcard.id}`;
      const postResponse = await axios.post(url, postBody);
      console.log(postResponse.data);
    } else {
      setOpen(true);
    }
  };

  return (
    <Card className="taskcard">
      <div className="card-header">
        <h3 className="card-title">{taskcard.cardTitle}</h3>
        <div className="card-buttons">
          <IconButton onClick={handleClickOpen}>
            <AddCircle color="primary" />
          </IconButton>
          <AddTaskDialog />
          <IconButton>
            <MoreVert />
          </IconButton>
          {/* TODO:Menu for more options. */}
        </div>
      </div>
    </Card>
  );

  function AddTaskDialog() {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Add a task"
            type="text"
            fullWidth
            variant="standard"
            inputRef={taskRef}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleAddTask}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
};

export default Taskcard;
