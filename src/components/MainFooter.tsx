import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useGlobalContext } from "../context/appContext";
import { useRef, useState } from "react";
import AddDialog from "./dialogs/AddDialog";
import axios from "axios";

const MainFooter = () => {
  const [open, setOpen] = useState(false);
  const taskboardRef = useRef<HTMLInputElement>();
  const { globalState, setGlobalState } = useGlobalContext();
  const { tasksboards, activeTasksboardId } = globalState;

  const changeActiveTasksboard = (tasksboardId: number) => {
    setGlobalState({ ...globalState, activeTasksboardId: tasksboardId });
  };

  // Dialog controls
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddTask = async () => {
    const newBoardTitle = taskboardRef.current?.value;
    if (newBoardTitle) {
      const postBody = {
        taskboardTitle: newBoardTitle,
      };
      const url = `${process.env.REACT_APP_BASE_URL}/taskboards`;
      const postResponse = await axios.post(url, postBody);
      const newTaskboard = postResponse.data;
      setGlobalState({
        ...globalState,
        tasksboards: [...tasksboards, newTaskboard],
      });
      setOpen(false);
    }
    console.log(newBoardTitle);
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
              onClick={() => changeActiveTasksboard(tasksboard.id)}
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
              onClick={() => changeActiveTasksboard(tasksboard.id)}
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
        handleSubmit={handleAddTask}
        open={open}
      />
    </div>
  );
};

export default MainFooter;
