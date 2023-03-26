export const SHOW_COMMAND = "show.command";
export const SHOW_ERROR = "show.error";
export const SHOW_INFO = "show.info";
export const SHOW_FIND = "show.find";
export const HIDE = "hide";

export interface HideAction {
  type: typeof HIDE;
}

export interface ShowCommand {
  type: typeof SHOW_COMMAND;
  text: string;
}

export interface ShowFindAction {
  type: typeof SHOW_FIND;
}

export interface ShowErrorAction {
  type: typeof SHOW_ERROR;
  message: string;
}

export interface ShowInfoAction {
  type: typeof SHOW_INFO;
  message: string;
}

export type AppAction =
  | HideAction
  | ShowCommand
  | ShowFindAction
  | ShowErrorAction
  | ShowInfoAction;

const hide = (): HideAction => {
  return {
    type: HIDE,
  };
};

const showCommand = (text: string): ShowCommand => {
  return {
    type: SHOW_COMMAND,
    text,
  };
};

const showFind = (): ShowFindAction => {
  return {
    type: SHOW_FIND,
  };
};

const showError = (message: string): ShowErrorAction => {
  return { type: SHOW_ERROR, message };
};

const showInfo = (message: string): ShowInfoAction => {
  return { type: SHOW_INFO, message };
};

export { hide, showCommand, showFind, showError, showInfo };
