export interface TaskboardInterface {
  id: number;
  boardTitle: string;
}

export interface globalStateInterface {
  activeTasksboardId: number;
  tasksboards: TaskboardInterface[];
  isLoading: boolean;
}

export interface globalContextInterface {
  globalState: globalStateInterface;
  fetchAllTasksboards: () => Promise<void>;
  changeActiveTaskboard: (tasksboardId: number) => void;
  handleAddTaskboard: (
    ref: React.MutableRefObject<HTMLInputElement | undefined>,
    setDialogState: React.Dispatch<React.SetStateAction<boolean>>
  ) => Promise<void>;
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
