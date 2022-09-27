import { Delete } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
  FormControl,
} from "@mui/material";
import axios from "axios";
import { useRef, useState } from "react";
import { useTaskcardContext } from "../../context/taskcardContext";
import { TaskitemInterface } from "../../interfaces/interfaces";
import { RichTextEditor } from "@mantine/rte";
import BasicDatePicker from "../misc/BasicDatePicker";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import BasicDateTimePicker from "../misc/BasicDateTimePicker";

axios.defaults.withCredentials = true;

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
  const [taskDate, setTaskDate] = useState<Dayjs | null>(
    dayjs(task.deadlineDate)
  );
  const rteRef = useRef<any>();
  const [isEvent, setIsEvent] = useState<"true" | "false" | "">("");
  const [eventStartDate, setEventStartDate] = useState<Dayjs | null>(
    dayjs(task.eventStartDate)
  );
  const [eventEndDate, setEventEndDate] = useState<Dayjs | null>(
    dayjs(task.eventEndDate)
  );

  const handleSubmit = async () => {
    const url = `${process.env.REACT_APP_API_URL}/tasks/${id}`;
    let newDescription = rteRef.current.value;
    if (newDescription === "<p><br></p>") {
      newDescription = "";
    }

    switch (isEvent) {
      case "true":
        {
          const patchBody = {
            taskTitle: currentTaskTitle,
            description: newDescription,
            eventStartDate,
            eventEndDate,
          };
          await axios.patch(url, patchBody);
          const updatedTasks = tasks.map((taskItem) => {
            if (taskItem.id === id) {
              taskItem.title = currentTaskTitle;
              taskItem.description = newDescription;
            }
            return taskItem;
          });
          setTasks(updatedTasks);
        }
        break;
      case "false":
        {
          const patchBody = {
            taskTitle: currentTaskTitle,
            description: newDescription,
            deadlineDate: taskDate?.add(1, "d").format("YYYY-MM-DDTHH:mm:ssZ"),
          };
          await axios.patch(url, patchBody);
          const updatedTasks = tasks.map((taskItem) => {
            if (taskItem.id === id) {
              taskItem.title = currentTaskTitle;
              taskItem.description = newDescription;
            }
            return taskItem;
          });
          setTasks(updatedTasks);
        }
        break;
      case "": {
        const patchBody = {
          taskTitle: currentTaskTitle,
          description: newDescription,
        };
        await axios.patch(url, patchBody);
        const updatedTasks = tasks.map((taskItem) => {
          if (taskItem.id === id) {
            taskItem.title = currentTaskTitle;
            taskItem.description = newDescription;
          }
          return taskItem;
        });
        setTasks(updatedTasks);
      }
    }
  };

  const deleteTask = async () => {
    const url = `${process.env.REACT_APP_API_URL}/tasks/${id}`;
    await axios.delete(url);
    const updatedTasks = tasks.filter((taskItem) => task.id !== taskItem.id);
    setTasks(updatedTasks);
  };

  const handleDateChange = (newDate: Dayjs | null) => {
    setTaskDate(newDate);
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setIsEvent(event.target.value as "true" | "false");
  };

  const handleStartDateChange = (newDate: Dayjs | null) => {
    setEventStartDate(newDate);
  };
  const handleEndDateChange = (newDate: Dayjs | null) => {
    setEventEndDate(newDate);
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
          <InputLabel id={"mode-label"}>Reminder mode</InputLabel>
          <FormControl>
            <Select
              id="mode-select"
              labelId="mode-label"
              label="Mode"
              value={isEvent}
              autoWidth
              variant="standard"
              onChange={handleSelectChange}
            >
              <MenuItem value={""}>Mode</MenuItem>
              <MenuItem value={"false"}>Task</MenuItem>
              <MenuItem value={"true"}>Event</MenuItem>
            </Select>
          </FormControl>

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

          {isEvent === "false" && (
            <BasicDatePicker
              date={taskDate}
              handleDateChange={handleDateChange}
            />
          )}

          {isEvent === "true" && (
            <>
              <BasicDateTimePicker
                date={eventStartDate}
                label="Event start"
                handleDateChange={handleStartDateChange}
              />
              <BasicDateTimePicker
                label="Event end"
                date={eventEndDate}
                handleDateChange={handleEndDateChange}
              />
            </>
          )}
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
