import { AddCircle, MoreVert } from "@mui/icons-material";
import { Card, IconButton, List } from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { TaskcardInterface, TaskitemInterface } from "../interfaces/interfaces";
import AddDialog from "./dialogs/AddDialog";
import Taskitem from "./Taskitem";

type Props = {
  taskcard: TaskcardInterface;
};
const Taskcard = ({ taskcard }: Props) => {
  const [open, setOpen] = useState(false);
  const taskRef = useRef<HTMLInputElement>();
  const [tasks, setTasks] = useState<TaskitemInterface[]>([]);

  const fetchAllTasks = async () => {
    const url = `${process.env.REACT_APP_BASE_URL}/tasks/${taskcard.id}`;
    const getResponse = await axios.get(url);
    const responseData: TaskitemInterface[] = getResponse.data;
    if (getResponse.status === 200) {
      setTasks(responseData);
    }
  };

  useEffect(() => {
    fetchAllTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dialog controls
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddTask = async () => {
    const taskToBeAdded = taskRef.current?.value;
    if (taskToBeAdded) {
      const postBody = {
        taskTitle: taskToBeAdded,
      };
      const url = `${process.env.REACT_APP_BASE_URL}/tasks/${taskcard.id}`;
      const postResponse = await axios.post(url, postBody);
      const newTask = postResponse.data;
      setTasks([...tasks, newTask]);
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  return (
    <Card className="taskcard">
      <div className="card-header">
        <h3 className="card-title">{taskcard.cardTitle}</h3>
        <div className="card-buttons">
          <IconButton onClick={handleClickOpen}>
            <AddCircle color="primary" />
          </IconButton>
          <AddDialog
            dialogLabel="Add a task"
            dialogTitle="Task"
            fieldRef={taskRef}
            handleClose={handleClose}
            handleSubmit={handleAddTask}
            open={open}
          />
          <IconButton>
            <MoreVert />
          </IconButton>
          {/* TODO:Menu for more options. */}
        </div>
      </div>
      <List>
        {tasks.map((task) => {
          return <Taskitem key={task.id}></Taskitem>;
        })}
      </List>
    </Card>
  );
};

export default Taskcard;
