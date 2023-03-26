import React from "react";
import * as actions from "./actions";
import { AppDispatchContext, AppStateContext } from "./contexts";
import CommandClient from "../clients/CommandClient";
import { newSender } from "../clients/BackgroundMessageSender";
import { SimplexSender } from "../../messaging";
import type {
  Schema as WindowMessageSchema,
  Key as WindowMessageKey,
  Request as WindowMessageRequest,
} from "../../messaging/schema/window";

const commandClient = new CommandClient(newSender());
const windowMessageSender = new SimplexSender<WindowMessageSchema>(
  (type: WindowMessageKey, args: WindowMessageRequest) => {
    const msg = JSON.stringify({ args, type });
    window.top.postMessage(msg, "*");
  }
);

export const useHide = () => {
  const dispatch = React.useContext(AppDispatchContext);
  const hide = React.useCallback(() => {
    windowMessageSender.send("console.unfocus");
    dispatch(actions.hide());
  }, [dispatch]);

  return hide;
};

export const useCommandMode = () => {
  const state = React.useContext(AppStateContext);
  const dispatch = React.useContext(AppDispatchContext);

  const show = React.useCallback(
    (initialInputValue: string) => {
      dispatch(actions.showCommand(initialInputValue));
    },
    [dispatch]
  );

  return {
    visible: state.mode === "command",
    initialInputValue: state.consoleText,
    show,
  };
};

export const useFindMode = () => {
  const state = React.useContext(AppStateContext);
  const dispatch = React.useContext(AppDispatchContext);

  const show = React.useCallback(() => {
    dispatch(actions.showFind());
  }, [dispatch]);

  return {
    visible: state.mode === "find",
    show,
  };
};

export const useInfoMessage = () => {
  const state = React.useContext(AppStateContext);
  const dispatch = React.useContext(AppDispatchContext);

  const show = React.useCallback(
    (message: string) => {
      dispatch(actions.showInfo(message));
    },
    [dispatch]
  );

  return {
    visible: state.mode === "info",
    message: state.mode === "info" ? state.messageText : "",
    show,
  };
};

export const useErrorMessage = () => {
  const state = React.useContext(AppStateContext);
  const dispatch = React.useContext(AppDispatchContext);

  const show = React.useCallback(
    (message: string) => {
      dispatch(actions.showError(message));
    },
    [dispatch]
  );

  return {
    visible: state.mode === "error",
    message: state.mode === "error" ? state.messageText : "",
    show,
  };
};

export const useExecCommand = () => {
  const execCommand = React.useCallback((text: string) => {
    commandClient.execCommand(text);
  }, []);
  return execCommand;
};

export const useExecFind = () => {
  const execFind = React.useCallback((text?: string) => {
    commandClient.execFind(text);
  }, []);
  return execFind;
};
