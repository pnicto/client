import {
  globalStateInterface,
  TaskboardInterface,
} from "../interfaces/interfaces";

type ACTIONS =
  | {
      type: "set taskboards";
      payload: { taskboards: TaskboardInterface[]; activeTaskboardId: number };
    }
  | {
      type: "change active taskboard";
      payload: number;
    }
  | {
      type: "add new taskboard";
      payload: TaskboardInterface;
    }
  | {
      type: "change theme";
      payload: "dark" | "light";
    };

export const reducer = (
  state: globalStateInterface,
  action: ACTIONS
): globalStateInterface => {
  switch (action.type) {
    case "set taskboards":
      return {
        ...state,
        tasksboards: action.payload.taskboards,
        activeTasksboardId: action.payload.activeTaskboardId,
        isLoading: false,
      };
    case "change active taskboard":
      return { ...state, activeTasksboardId: action.payload };
    case "add new taskboard":
      return { ...state, tasksboards: [...state.tasksboards, action.payload] };
    case "change theme":
      return {
        ...state,
        themeMode: action.payload,
      };
    default:
      throw new Error("Reducer error");
  }
};
