/* eslint-disable array-callback-return */
import { Card, ListItemButton, Paper } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../context/appContext";
import Taskcard from "./Taskcard";
import AddDialog from "./dialogs/AddDialog";
import { Add } from "@mui/icons-material";
import axios from "axios";
import { TaskcardInterface } from "../interfaces/interfaces";

const Taskboard = () => {
  const [isShared, setIsShared] = useState(false);
  const { globalState, globalDispatch, handleAddComponent } =
    useGlobalContext();
  const { activeTaskboardId, currentTaskcards, taskboards } = globalState;
  const { userTaskboards, sharedTaskboards } = taskboards;
  // Refs
  const taskcardRef = useRef<HTMLInputElement>();

  //Dialog actions
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    sharedTaskboards?.find((taskboard) => {
      if (taskboard.id === activeTaskboardId) setIsShared(true);
    });

    userTaskboards.find((taskboard) => {
      if (taskboard.id === activeTaskboardId) setIsShared(false);
    });
    globalDispatch({
      type: "change shared board state",
      payload: isShared,
    });
    const fetchAllTaskscards = async () => {
      let url;
      const activeTaskboard = sharedTaskboards?.find(
        (taskboard) => taskboard.id === activeTaskboardId
      );
      if (isShared && activeTaskboard?.userId) {
        url = `${process.env.REACT_APP_API_URL}/taskCards/${activeTaskboardId}/${activeTaskboard?.userId}`;
      } else {
        url = `${process.env.REACT_APP_API_URL}/taskCards/${activeTaskboardId}`;
      }
      const getResponse = await axios.get(url);

      const responseData: TaskcardInterface[] = getResponse.data;

      if (getResponse.status === 200) {
        globalDispatch({
          type: "set taskcards",
          payload: responseData,
        });
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

  return !isShared ? (
    <Paper square={true}>
      <div id="taskboard">
        {currentTaskcards?.map((taskcard) => {
          return <Taskcard key={taskcard.id} taskcard={taskcard}></Taskcard>;
        })}
        <Card className="taskcard" elevation={3}>
          <ListItemButton className="add-card-btn" onClick={handleClickOpen}>
            <Add color="primary" /> Add new list
          </ListItemButton>
        </Card>
        <AddDialog
          dialogLabel="Create a new list"
          dialogTitle="List name"
          fieldRef={taskcardRef}
          handleClose={handleClose}
          handleSubmit={() => {
            const taskcardTitle = taskcardRef.current?.value;
            if (taskcardTitle) {
              return handleAddComponent(taskcardTitle, setOpen, "taskcard");
            }
            throw new Error("taskcard addition");
          }}
          open={open}
        />{" "}
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
