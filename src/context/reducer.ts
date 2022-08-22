import {
  globalStateInterface,
  TaskboardInterface,
  TaskcardInterface,
} from "../interfaces/interfaces";

export type ACTIONS =
  | {
      type: "set taskboards";
      payload: { taskboards: TaskboardInterface[]; activeTaskboardId: number };
    }
  | {
      type: "set taskcards";
      payload: TaskcardInterface[];
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
      type: "add new taskcard";
      payload: TaskcardInterface;
    }
  | {
      type: "delete taskcard";
      payload: number;
    }
  | {
      type: "change theme";
      payload: "dark" | "light";
    }
  | {
      type: "clear all taskcards";
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
        activeTaskboardId: action.payload.activeTaskboardId,
        isLoading: false,
      };
    case "set taskcards":
      return {
        ...state,
        currentTaskcards: action.payload,
      };
    case "change active taskboard":
      return { ...state, activeTaskboardId: action.payload };
    case "add new taskboard":
      return { ...state, tasksboards: [...state.tasksboards, action.payload] };
    case "add new taskcard":
      return {
        ...state,
        currentTaskcards: [...state.currentTaskcards, action.payload],
      };
    case "clear all taskcards":
      return {
        ...state,
        currentTaskcards: [],
      };
    case "delete taskcard":
      const remainingTaskcards = state.currentTaskcards.filter(
        (taskcard) => taskcard.id !== action.payload
      );
      return {
        ...state,
        currentTaskcards: [...remainingTaskcards],
      };
    case "change theme":
      return {
        ...state,
        themeMode: action.payload,
      };

    default:
      throw new Error("Reducer error");
  }
};
