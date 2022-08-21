import { Card, ListItemButton, Paper } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../context/appContext";
import Taskcard from "./Taskcard";
import AddDialog from "./dialogs/AddDialog";
import { Add } from "@mui/icons-material";

const Taskboard = () => {
  const { globalState, fetchAllTaskscards, handleAddTaskcard } =
    useGlobalContext();
  const { activeTasksboardId, currentTaskcards } = globalState;
  const [open, setOpen] = useState(false);
  const taskcardRef = useRef<HTMLInputElement>();
  // const [taskcards, setTaskcards] = useState<TaskcardInterface[]>([]);

  // Dialog controls
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchAllTaskscards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTasksboardId]);

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
          handleSubmit={() => handleAddTaskcard(taskcardRef, setOpen)}
          open={open}
        />{" "}
      </div>
    </Paper>
  );
};

export default Taskboard;
