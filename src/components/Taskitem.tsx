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
import { useGlobalContext } from "../context/appContext";
import parse from "html-react-parser";

interface Props {
  task: TaskitemInterface;
}

const Taskitem = ({ task }: Props) => {
  const [isComplete, setIsComplete] = useState(task.completed);
  const { globalState } = useGlobalContext();
  const { isShared } = globalState;

  // Edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Edit dialog actions
  const handleClickOpen = () => {
    setIsEditDialogOpen(true);
  };
  const handleClose = () => {
    setIsEditDialogOpen(false);
  };

  const changeCompletionStatus = async () => {
    const url = `${process.env.REACT_APP_API_URL}/tasks/${task.id}`;
    await axios.patch(url, {
      completed: !isComplete,
    });
    setIsComplete(!isComplete);
  };

  // If shared make it view only
  return !isShared ? (
    <ListItem
      disablePadding={true}
      className={`task-item ${isComplete && "complete"}`}
      secondaryAction={
        <IconButton onClick={handleClickOpen}>
          <Edit />
        </IconButton>
      }
    >
      {
        // Custom edit menu
        <TaskEditMenu
          open={isEditDialogOpen}
          handleClose={handleClose}
          task={task}
        />
      }
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
          secondary={<>{parse(task.description ?? "")}</>}
          className="task-title"
        >
          {task.title}
        </ListItemText>
      </ListItemButton>
    </ListItem>
  ) : (
    <ListItem
      disablePadding={true}
      className={`task-item ${isComplete && "complete"}`}
    >
      {/* Custom edit menu */}
      <Checkbox
        onClick={changeCompletionStatus}
        checked={isComplete}
        disableRipple={true}
        disabled={true}
      />
      <ListItemText secondary={<>{task.description}</>} className="task-title">
        {task.title}
      </ListItemText>
    </ListItem>
  );
};

export default Taskitem;
