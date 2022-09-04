import { ACTIONS } from "../context/reducer";

export interface TaskboardInterface {
  id: number;
  boardTitle: string;
}

export interface globalStateInterface {
  activeTaskboardId: number;
  tasksboards: TaskboardInterface[];
  isLoading: boolean;
  themeMode: "dark" | "light";
  currentTaskcards: TaskcardInterface[];
}

export interface globalContextInterface {
  globalState: globalStateInterface;
  globalDispatch: React.Dispatch<ACTIONS>;
  handleAddComponent: (
    componentName: string,
    setDialogState: React.Dispatch<React.SetStateAction<boolean>>,
    componentBeingAdded: "taskcard" | "taskboard"
  ) => Promise<void>;
}

export interface taskcardContextInterface {
  tasks: TaskitemInterface[];
  setTasks: React.Dispatch<React.SetStateAction<TaskitemInterface[]>>;
}

export interface TaskcardInterface {
  id: number;
  cardTitle: string;
  taskboardId: number;
}

export interface TaskitemInterface {
  id: number;
  description: string;
  completed: boolean;
  taskcardId: number;
  title: string;
}
