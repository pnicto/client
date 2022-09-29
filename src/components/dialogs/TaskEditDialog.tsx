import { Clear, Delete } from "@mui/icons-material";
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
import { useGlobalContext } from "../../context/appContext";

axios.defaults.withCredentials = true;

interface Props {
  open: boolean;
  handleClose: () => void;
  task: TaskitemInterface;
}

const TaskEditMenu = ({ open, handleClose, task }: Props) => {
  const { title, id, description } = task;

  // State values for title, description, dates and reminder mode
  const [currentTaskTitle, setCurrentTaskTitle] = useState(title);
  const [currentTaskDescription, setCurrentTaskDescription] =
    useState(description);
  const [taskDate, setTaskDate] = useState<Dayjs | null>(
    dayjs(task.deadlineDate)
  );
  // isEvent true for google calendar events, false for google tasks, "" for neither of them
  const [isEvent, setIsEvent] = useState<"true" | "false" | "">("");
  const [eventStartDate, setEventStartDate] = useState<Dayjs | null>(
    dayjs(task.eventStartDate)
  );
  const [eventEndDate, setEventEndDate] = useState<Dayjs | null>(
    dayjs(task.eventEndDate)
  );

  // tasks from provider
  const { tasks, setTasks } = useTaskcardContext();

  // Ref for rte
  const rteRef = useRef<any>();

  const { globalDispatch, globalState } = useGlobalContext();
  const { hasUsedGoogleOauth } = globalState;

  const handleSubmit = async () => {
    const url = `${process.env.REACT_APP_API_URL}/tasks/${id}`;
    let newDescription = rteRef.current.value;

    // Mantine rte gives the following html instead of "" when empty, so I change it to "" for storing it in db
    if (newDescription === "<p><br></p>") {
      newDescription = "";
    }
    switch (isEvent) {
      // If isEvent true then verify the dates and make request
      case "true":
        if (dayjs(eventEndDate)?.isAfter(dayjs(eventStartDate))) {
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
        } else {
          globalDispatch({
            type: "update snackbar",
            payload: {
              severity: "error",
              message: "End date cannot be before start date",
            },
          });
        }
        break;

      // If tasks reminder
      // TODO: Verify the date offset
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

      // A normal taskboard task
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

  // Handle change for reminder mode
  const handleSelectChange = (event: SelectChangeEvent) => {
    if (hasUsedGoogleOauth) {
      setIsEvent(event.target.value as "true" | "false");
    } else {
      // Event mode only available if logged in with google oauth
      globalDispatch({
        type: "update snackbar",
        payload: {
          severity: "error",
          message:
            "You need to login using google oauth to perform this action.",
        },
      });
    }
  };

  const handleStartDateChange = (newDate: Dayjs | null) => {
    setEventStartDate(newDate);
  };
  const handleEndDateChange = (newDate: Dayjs | null) => {
    setEventEndDate(newDate);
  };

  return (
    // Full screen dialog
    <Dialog open={open} onClose={handleClose} fullScreen>
      <DialogTitle className="edit-task-header">
        <>Edit Task</>
        {/* Icon button to delete task */}
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
      {/* Form which stays open if task title is empty */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (currentTaskTitle) {
            handleClose();
            handleSubmit();
          } else {
            globalDispatch({
              type: "update snackbar",
              payload: {
                message: "Task title cannot be empty",
                severity: "error",
              },
            });
          }
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

          {/* Show date/datetime pickers according to the event mode*/}

          {isEvent === "false" && (
            <>
              <BasicDatePicker
                date={taskDate}
                handleDateChange={handleDateChange}
              />
              <IconButton
                color="error"
                onClick={() => {
                  setTaskDate(null);
                }}
              >
                <Clear />
              </IconButton>
            </>
          )}

          {isEvent === "true" && (
            <>
              <div className="pickers-div">
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
                <IconButton
                  color="error"
                  onClick={() => {
                    setEventStartDate(null);
                    setEventEndDate(null);
                  }}
                >
                  <Clear />
                </IconButton>
              </div>
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
