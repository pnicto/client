import React from "react";

interface Tasksboard {
  id: number;
  boardTitle: string;
}

interface globalContextInterface {
  globalState: globalState;
  setGlobalState: React.Dispatch<React.SetStateAction<globalState>>;
}

interface globalState {
  activeTasksboardId: number;
  tasksboards: Tasksboard[];
  isLoading: boolean;
}

export type { Tasksboard, globalContextInterface, globalState };
