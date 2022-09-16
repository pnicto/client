import { Edit } from "@mui/icons-material";
import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { TaskitemInterface } from "../interfaces/interfaces";
import TaskEditMenu from "../components/dialogs/TaskEditDialog";

interface Props {
  task: TaskitemInterface;
}
const Taskitem = ({ task }: Props) => {
  // Edit dialog state
  const [open, setOpen] = useState(false);

  // Edit dialog actions
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [isComplete, setIsComplete] = useState(task.completed);

  const changeCompletionStatus = async () => {
    const url = `${process.env.REACT_APP_API_URL}/tasks/${task.id}`;
    await axios.patch(url, {
      completed: !isComplete,
    });
    setIsComplete(!isComplete);
  };

  return (
    <ListItem
      disablePadding={true}
      className={`task-item ${isComplete && "complete"}`}
      secondaryAction={
        <IconButton onClick={handleClickOpen}>
          <Edit />
        </IconButton>
      }
    >
      {/* Custom edit menu */}
      <TaskEditMenu open={open} handleClose={handleClose} task={task} />
      <ListItemButton
        disableGutters={true}
        onClick={() => changeCompletionStatus()}
      >
        <Checkbox
          onClick={changeCompletionStatus}
          checked={isComplete}
          disableRipple={true}
        />
        <ListItemText
          secondary={<>{task.description}</>}
          className="task-title"
        >
          {task.title}
        </ListItemText>
      </ListItemButton>
    </ListItem>
  );
};

export default Taskitem;
