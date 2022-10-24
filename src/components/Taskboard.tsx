import { Card, ListItemButton, Paper } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../context/appContext";
import Taskcard from "./Taskcard";
import AddDialog from "./dialogs/AddDialog";
import { Add } from "@mui/icons-material";
import axios from "axios";
import { TaskcardInterface } from "../interfaces/interfaces";
import { errorCodes } from "../interfaces/errors";

const Taskboard = () => {
  const [isShared, setIsShared] = useState(false);
  const { globalState, globalDispatch, handleAddComponent } =
    useGlobalContext();
  const { activeTaskboardId, currentTaskcards, taskboards } = globalState;
  const { userTaskboards, sharedTaskboards } = taskboards;

  // Refs
  const taskcardRef = useRef<HTMLInputElement>();

  //Dialog actions
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const handleAddDialogOpen = () => {
    setIsAddDialogOpen(true);
  };
  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
  };

  useEffect(() => {
    // TODO: See if I can optimize or find an alternative way
    // Change the isShared status if the taskboard is shared. This is for making it view only
    sharedTaskboards?.forEach((taskboard) => {
      if (taskboard.id === activeTaskboardId) setIsShared(true);
    });
    userTaskboards.forEach((taskboard) => {
      if (taskboard.id === activeTaskboardId) setIsShared(false);
    });
    globalDispatch({
      type: "change shared board state",
      payload: isShared,
    });
    const fetchAllTaskscards = async () => {
      let url;

      // Find the active taskboard
      const activeTaskboard = sharedTaskboards?.find(
        (taskboard) => taskboard.id === activeTaskboardId
      );

      // If shared then send the userId of the owner to send the view only cards and tasks
      if (isShared && activeTaskboard?.userId) {
        url = `${
          import.meta.env.VITE_APP_API_URL
        }/taskCards/${activeTaskboardId}/${activeTaskboard?.userId}`;
      } else {
        url = `${
          import.meta.env.VITE_APP_API_URL
        }/taskCards/${activeTaskboardId}`;
      }
      try {
        const getResponse = await axios.get(url);
        const responseData: TaskcardInterface[] = getResponse.data;
        if (getResponse.status === 200) {
          globalDispatch({
            type: "set taskcards",
            payload: responseData,
          });
        }
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.code === errorCodes.networkError
        ) {
          globalDispatch({
            type: "update snackbar",
            payload: {
              message:
                "There's some issue with your network. Could not fetch taskcards",
              severity: "error",
            },
          });
        }
      }
    };

    fetchAllTaskscards();
  }, [
    activeTaskboardId,
    globalDispatch,
    isShared,
    sharedTaskboards,
    userTaskboards,
  ]);

  // If shared then make them view only
  return !isShared ? (
    <Paper square={true}>
      <div id="taskboard">
        {currentTaskcards?.map((taskcard) => {
          return <Taskcard key={taskcard.id} taskcard={taskcard}></Taskcard>;
        })}
        <Card className="taskcard" elevation={3}>
          <ListItemButton
            className="add-card-btn"
            onClick={handleAddDialogOpen}
          >
            <Add color="primary" /> Add new list
          </ListItemButton>
        </Card>
        {/* Refer the file for info */}
        <AddDialog
          dialogLabel="Create a new list"
          dialogTitle="List name"
          fieldRef={taskcardRef}
          handleClose={handleAddDialogClose}
          handleSubmit={() => {
            const taskcardTitle = taskcardRef.current?.value;
            if (taskcardTitle) {
              handleAddComponent(taskcardTitle, setIsAddDialogOpen, "taskcard");
            } else {
              throw new Error("taskcard addition");
            }
          }}
          open={isAddDialogOpen}
        />
      </div>
    </Paper>
  ) : (
    <Paper square={true}>
      <div id="taskboard">
        {currentTaskcards?.map((taskcard) => {
          return <Taskcard key={taskcard.id} taskcard={taskcard}></Taskcard>;
        })}
      </div>
    </Paper>
  );
};

export default Taskboard;
