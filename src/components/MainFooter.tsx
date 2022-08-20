import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useGlobalContext } from "../context/appContext";
import { useRef, useState } from "react";
import AddDialog from "./dialogs/AddDialog";

const MainFooter = () => {
  const [open, setOpen] = useState(false);
  const taskboardRef = useRef<HTMLInputElement>();
  const { globalState, changeActiveTaskboard, handleAddTaskboard } =
    useGlobalContext();
  const { tasksboards, activeTasksboardId } = globalState;

  // Dialog controls
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div id="main-footer">
      {tasksboards.map((tasksboard) => {
        // Scale the button which shows the active tasksboard.
        if (activeTasksboardId === tasksboard.id) {
          return (
            <Button
              key={tasksboard.id}
              variant="contained"
              color="secondary"
              className="active"
              onClick={() => changeActiveTaskboard(tasksboard.id)}
            >
              {tasksboard.boardTitle}
            </Button>
          );
        } else {
          return (
            <Button
              key={tasksboard.id}
              variant="contained"
              color="secondary"
              onClick={() => changeActiveTaskboard(tasksboard.id)}
            >
              {tasksboard.boardTitle}
            </Button>
          );
        }
      })}
      <Button onClick={handleClickOpen}>
        <AddIcon />
      </Button>
      <AddDialog
        dialogLabel="Create a tasksboard"
        dialogTitle="Name"
        fieldRef={taskboardRef}
        handleClose={handleClose}
        handleSubmit={() => handleAddTaskboard(taskboardRef, setOpen)}
        open={open}
      />
    </div>
  );
};

export default MainFooter;
