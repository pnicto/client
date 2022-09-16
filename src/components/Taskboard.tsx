import { Card, ListItemButton, Paper } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../context/appContext";
import Taskcard from "./Taskcard";
import AddDialog from "./dialogs/AddDialog";
import { Add } from "@mui/icons-material";
import axios from "axios";
import { TaskcardInterface } from "../interfaces/interfaces";

const Taskboard = () => {
  const { globalState, globalDispatch, handleAddComponent } =
    useGlobalContext();
  const { activeTaskboardId, currentTaskcards } = globalState;

  const fetchAllTaskscards = async () => {
    const url = `${process.env.REACT_APP_API_URL}/taskCards/${activeTaskboardId}`;
    const getResponse = await axios.get(url);
    const responseData: TaskcardInterface[] = getResponse.data;

    if (getResponse.status === 200) {
      globalDispatch({
        type: "set taskcards",
        payload: responseData,
      });
    }
  };

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
    fetchAllTaskscards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTaskboardId]);

  return (
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
  );
};

export default Taskboard;
