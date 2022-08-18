interface Tasksboard {
  id: number;
  boardTitle: string;
}

interface globalContextInterface {
  activeTasksboardId: number;
}

export type { Tasksboard, globalContextInterface };
