import { Button, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useGlobalContext } from "../context/appContext";
import { useRef, useState } from "react";
import AddDialog from "./dialogs/AddDialog";

const MainFooter = () => {
  const { globalState, globalDispatch, handleAddComponent } =
    useGlobalContext();
  const { taskboards, activeTaskboardId } = globalState;
  const { userTaskboards, sharedTaskboards } = taskboards;

  const changeActiveTaskboard = (tasksboardId: number) => {
    globalDispatch({
      type: "change active taskboard",
      payload: tasksboardId,
    });
  };

  // Refs
  const taskboardRef = useRef<HTMLInputElement>();

  // Dialog actions
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const handleClickOpen = () => {
    setIsAddDialogOpen(true);
  };
  const handleClose = () => {
    setIsAddDialogOpen(false);
  };

  return (
    <div id="main-footer">
      <Paper square={true} elevation={3}>
        {userTaskboards.map((tasksboard) => {
          // Scale the button which shows the active tasksboard.
          if (activeTaskboardId === tasksboard.id) {
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
        {sharedTaskboards?.map((taskboard) => {
          // Scale the button which shows the active tasksboard.
          if (activeTaskboardId === taskboard.id) {
            return (
              <Button
                key={taskboard.id}
                variant="contained"
                color="info"
                className="active shared"
                onClick={() => changeActiveTaskboard(taskboard.id)}
              >
                <p>{taskboard.boardTitle}</p>
              </Button>
            );
          } else {
            return (
              <Button
                className="shared"
                key={taskboard.id}
                variant="contained"
                color="info"
                onClick={() => changeActiveTaskboard(taskboard.id)}
              >
                <p>{taskboard.boardTitle}</p>
              </Button>
            );
          }
        })}

        {/* Adding new taskboard button */}
        <Button
          onClick={handleClickOpen}
          color="secondary"
          title="add taskboard"
          variant="contained"
        >
          <AddIcon color="primary" />
        </Button>
        <AddDialog
          dialogLabel="Create a tasksboard"
          dialogTitle="Name"
          fieldRef={taskboardRef}
          handleClose={handleClose}
          handleSubmit={() => {
            const taskboardTitle = taskboardRef.current?.value;
            if (taskboardTitle) {
              return handleAddComponent(
                taskboardTitle,
                setIsAddDialogOpen,
                "taskboard"
              );
            }
            throw new Error("taskboard addition");
          }}
          open={isAddDialogOpen}
        />
      </Paper>
    </div>
  );
};

export default MainFooter;
