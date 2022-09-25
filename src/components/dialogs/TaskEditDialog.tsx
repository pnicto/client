import { Delete } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { useRef, useState } from "react";
import { useTaskcardContext } from "../../context/taskcardContext";
import { TaskitemInterface } from "../../interfaces/interfaces";
import { RichTextEditor } from "@mantine/rte";
import BasicDatePicker from "../misc/BasicDatePicker";
import { Dayjs } from "dayjs";
interface Props {
  open: boolean;
  handleClose: () => void;
  task: TaskitemInterface;
}

const TaskEditMenu = ({ open, handleClose, task }: Props) => {
  const { title, id, description } = task;
  const [currentTaskTitle, setCurrentTaskTitle] = useState(title);
  const [currentTaskDescription, setCurrentTaskDescription] =
    useState(description);
  const { tasks, setTasks } = useTaskcardContext();
  const [date, setDate] = useState<Dayjs | null>(null);
  const rteRef = useRef<any>();

  const handleSubmit = async () => {
    const url = `${process.env.REACT_APP_API_URL}/tasks/${id}`;
    const patchBody = {
      taskTitle: currentTaskTitle,
      description: currentTaskDescription,
      deadlineDate: date?.add(1, "d").format("YYYY-MM-DDTHH:mm:ssZ"),
    };
    await axios.patch(url, patchBody);
    const updatedTasks = tasks.map((taskItem) => {
      if (taskItem.id === id) {
        taskItem.title = currentTaskTitle;
        taskItem.description = currentTaskDescription;
      }
      return taskItem;
    });
    setTasks(updatedTasks);
  };

  const deleteTask = async () => {
    const url = `${process.env.REACT_APP_API_URL}/tasks/${id}`;
    await axios.delete(url);
    const updatedTasks = tasks.filter((taskItem) => task.id !== taskItem.id);
    setTasks(updatedTasks);
  };

  const handleDateChange = (newDate: Dayjs | null) => {
    setDate(newDate);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullScreen>
      <DialogTitle className="edit-task-header">
        <>Edit Task</>
        <IconButton
          onClick={() => {
            handleClose();
            deleteTask();
          }}
          color="error"
        >
          <Delete />
        </IconButton>
      </DialogTitle>
      <form
        onSubmit={(event) => {
          handleClose();
          event.preventDefault();
          handleSubmit();
        }}
      >
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            value={currentTaskTitle}
            fullWidth
            variant="standard"
            label="Task"
            id="task"
            onChange={(event) => {
              setCurrentTaskTitle(event.target.value);
            }}
          />
          <h4>Description</h4>
          <RichTextEditor
            className="rich-text-editor"
            value={currentTaskDescription}
            onChange={setCurrentTaskDescription}
            id="rte"
            controls={[
              ["bold", "italic", "underline", "link", "strike"],
              ["orderedList", "unorderedList"],
              ["alignLeft", "alignCenter", "alignRight"],
              ["sub", "sup"],
              ["blockquote", "code", "codeBlock"],
            ]}
            ref={rteRef}
          />
          <BasicDatePicker date={date} handleDateChange={handleDateChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            Make changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskEditMenu;
