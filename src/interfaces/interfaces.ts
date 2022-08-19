import React from "react";

export interface TasksboardInterface {
  id: number;
  boardTitle: string;
}

export interface globalContextInterface {
  globalState: globalStateInterface;
  setGlobalState: React.Dispatch<React.SetStateAction<globalStateInterface>>;
}

export interface globalStateInterface {
  activeTasksboardId: number;
  tasksboards: TasksboardInterface[];
  isLoading: boolean;
}

export interface TaskcardInterface {
  id: number;
  cardTitle: string;
  taskboardId: number;
}
