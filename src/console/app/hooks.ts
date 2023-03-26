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

export const useVisibility = () => {
  const dispatch = React.useContext(AppDispatchContext);
  const state = React.useContext(AppStateContext);
  const visible = React.useMemo(
    () => typeof state.mode !== "undefined",
    [state]
  );
  const hide = React.useCallback(() => {
    windowMessageSender.send("console.unfocus");
    dispatch(actions.hide());
  }, [dispatch]);

  return {
    visible,
    hide,
  };
};

export const useConsoleMode = () => {
  const state = React.useContext(AppStateContext);
  const dispatch = React.useContext(AppDispatchContext);

  const showCommandPrompt = React.useCallback(
    (initialInputValue: string) => {
      dispatch(actions.showCommand(initialInputValue));
    },
    [dispatch]
  );

  const showFindPrompt = React.useCallback(() => {
    dispatch(actions.showFind());
  }, [dispatch]);

  const showInfoMessage = React.useCallback(
    (message: string) => {
      dispatch(actions.showInfo(message));
    },
    [dispatch]
  );

  const showErrorMessage = React.useCallback(
    (message: string) => {
      dispatch(actions.showError(message));
    },
    [dispatch]
  );

  return {
    state,
    showCommandPrompt,
    showFindPrompt,
    showInfoMessage,
    showErrorMessage,
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
