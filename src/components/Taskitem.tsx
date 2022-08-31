import { Edit } from "@mui/icons-material";
import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { TaskitemInterface } from "../interfaces/interfaces";

const Taskitem = ({ id, completed, description, title }: TaskitemInterface) => {
  const [isComplete, setIsComplete] = useState(completed);

  const changeCompletionStatus = async () => {
    const url = `${process.env.REACT_APP_BASE_URL}/tasks/${id}`;
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
        <IconButton onClick={() => console.log("Pressed edit")}>
          <Edit />
        </IconButton>
      }
    >
      <ListItemButton
        disableGutters={true}
        onClick={() => changeCompletionStatus()}
      >
        <Checkbox
          onClick={changeCompletionStatus}
          checked={isComplete}
          disableRipple={true}
        />
        <ListItemText secondary={<>{description}</>} className="task-title">
          {title}
        </ListItemText>
      </ListItemButton>
    </ListItem>
  );
};

export default Taskitem;
