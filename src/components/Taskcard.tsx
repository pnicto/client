import { AddCircle, MoreVert } from "@mui/icons-material";
import { Card, IconButton, List } from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../context/appContext";
import { TaskcardInterface, TaskitemInterface } from "../interfaces/interfaces";
import AddDialog from "./dialogs/AddDialog";
import OptionsMenu from "./menus/OptionsMenu";
import Taskitem from "./Taskitem";

type Props = {
  taskcard: TaskcardInterface;
};

const Taskcard = ({ taskcard }: Props) => {
  const [open, setOpen] = useState(false);
  const taskRef = useRef<HTMLInputElement>();
  const taskcardRef = useRef<HTMLInputElement>();
  const [tasks, setTasks] = useState<TaskitemInterface[]>([]);
  const { globalDispatch } = useGlobalContext();
  // Functions that handle the menu from MUI docs.
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const deleteTaskcard = async (taskcardId: number) => {
    const url = `${process.env.REACT_APP_BASE_URL}/taskcards/${taskcardId}`;
    await axios.delete(url);
    globalDispatch({
      type: "delete taskcard",
      payload: taskcardId,
    });
  };

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

  const handleRenameList = async (newListTitle: string) => {
    if (newListTitle) {
      const url = `${process.env.REACT_APP_BASE_URL}/taskcards/${taskcard.id}`;
      await axios.patch(url, {
        cardTitle: newListTitle,
      });
      globalDispatch({
        type: "update taskcard",
        payload: { newListTitle, taskcardId: taskcard.id },
      });
    } else {
      console.log(newListTitle);
    }
  };

  return (
    <Card className="taskcard" elevation={3}>
      <div className="card-header">
        <h4 className="card-title">{taskcard.cardTitle}</h4>
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
          <IconButton aria-label="more card actions" onClick={openMenu}>
            <MoreVert />
          </IconButton>
          <OptionsMenu
            anchorEl={anchorEl}
            closeMenu={closeMenu}
            open={isMenuOpen}
            component="list"
            fieldRef={taskcardRef}
            deleteAction={() => deleteTaskcard(taskcard.id)}
            renameAction={() => {
              const newListTitle = taskcardRef.current?.value;
              if (newListTitle) {
                return handleRenameList(newListTitle);
              }
            }}
          />
        </div>
      </div>
      <List>
        {tasks.map((task) => {
          return <Taskitem key={task.id} {...task}></Taskitem>;
        })}
      </List>
    </Card>
  );
};

export default Taskcard;
