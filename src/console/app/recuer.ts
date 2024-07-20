import {
  HIDE,
  SHOW_COMMAND,
  SHOW_ERROR,
  SHOW_FIND,
  SHOW_INFO,
  type AppAction,
} from "./actions";

export type State =
  | { mode: undefined }
  | { mode: "prompt"; promptMode: "command"; initValue: string }
  | { mode: "prompt"; promptMode: "find"; initValue: string }
  | { mode: "info_message"; message: string }
  | { mode: "error_message"; message: string };

export const defaultState: State = { mode: undefined };

export function reducer(state: State = defaultState, action: AppAction): State {
  switch (action.type) {
    case HIDE:
      return { mode: undefined };
    case SHOW_COMMAND:
      return {
        mode: "prompt",
        promptMode: "command",
        initValue: action.text,
      };
    case SHOW_FIND:
      return { mode: "prompt", promptMode: "find", initValue: "" };
    case SHOW_ERROR:
      return { ...state, mode: "error_message", message: action.message };
    case SHOW_INFO:
      return { ...state, mode: "info_message", message: action.message };
    default:
      return state;
  }
}
