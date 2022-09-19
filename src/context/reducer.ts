import { AlertColor } from "@mui/material";
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
      type: "update taskboard";
      payload: string;
    }
  | {
      type: "update taskcard";
      payload: { newListTitle: string; taskcardId: number };
    }
  | {
      type: "delete taskboard";
      payload: TaskboardInterface;
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
    }
  | {
      type: "login user";
      payload: {
        email: string;
        id: number;
        username: string;
      };
    }
  | {
      type: "close snackbar";
    }
  | {
      type: "update snackbar";
      payload: {
        severity: AlertColor;
        message: string;
        isOpen: boolean;
      };
    }
  | {
      type: "set session token";
      payload: string;
    }
  | {
      type: "logout user";
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

    case "update taskboard":
      const afterUpdatingBoards = state.tasksboards.map((taskboard) => {
        if (taskboard.id === state.activeTaskboardId) {
          taskboard.boardTitle = action.payload;
        }
        return taskboard;
      });
      return {
        ...state,
        tasksboards: [...afterUpdatingBoards],
      };

    case "update taskcard":
      const afterUpdatingCards = state.currentTaskcards.map((list) => {
        if (list.id === action.payload.taskcardId) {
          list.cardTitle = action.payload.newListTitle;
        }
        return list;
      });
      return {
        ...state,
        currentTaskcards: [...afterUpdatingCards],
      };

    case "delete taskcard":
      const remainingTaskcards = state.currentTaskcards.filter(
        (taskcard) => taskcard.id !== action.payload
      );
      return {
        ...state,
        currentTaskcards: [...remainingTaskcards],
      };

    case "delete taskboard":
      const remainingTaskboards = state.tasksboards.filter(
        (taskboard) => taskboard.id !== action.payload.id
      );
      return {
        ...state,
        tasksboards: [...remainingTaskboards],
        activeTaskboardId:
          remainingTaskboards[remainingTaskboards.length - 1].id,
      };

    case "change theme":
      return {
        ...state,
        themeMode: action.payload,
      };

    case "login user":
      return {
        ...state,
        user: action.payload,
      };

    case "close snackbar":
      return {
        ...state,
        snackbarState: {
          ...state.snackbarState,
          isOpen: false,
        },
      };

    case "update snackbar":
      const { isOpen, message, severity } = action.payload;
      return {
        ...state,
        snackbarState: {
          ...state.snackbarState,
          isOpen,
          message,
          severity,
        },
      };

    case "set session token":
      sessionStorage.setItem("token", action.payload);
      return {
        ...state,
      };

    case "logout user":
      sessionStorage.removeItem("token");
      return {
        ...state,
      };
    
    default:
      throw new Error("Reducer error");
  }
};
