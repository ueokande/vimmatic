import React from "react";
import Prompt from "./Prompt";
import InfoMessage from "./InfoMessage";
import ErrorMessage from "./ErrorMessage";
import { useConsoleMode } from "../app/hooks";
import { useExecCommand, useExecFind, useVisibility } from "../app/hooks";
import CompletionClient from "../clients/CompletionClient";
import { newSender } from "../clients/BackgroundMessageSender";

const completionClient = new CompletionClient(newSender());

const Console: React.FC = () => {
  const { hide } = useVisibility();
  const { state } = useConsoleMode();
  const execCommand = useExecCommand();
  const execFind = useExecFind();

  const onExec = React.useCallback(
    (cmd: string) => {
      if (state.mode !== "prompt") {
        return;
      }
      if (state.promptMode === "command") {
        execCommand(cmd);
      } else if (state.promptMode === "find") {
        execFind(cmd);
      }
    },
    [execCommand, execFind, state]
  );

  const queryCompletions = React.useCallback(
    (query: string) => {
      if (state.mode !== "prompt") {
        return Promise.resolve([]);
      }
      if (state.promptMode === "command") {
        return completionClient.getCompletions(query);
      }
      return Promise.resolve([]);
    },
    [execCommand, execFind, state]
  );

  if (state.mode === "prompt") {
    if (state.promptMode === "command") {
      return (
        <Prompt
          prefix={":"}
          onBlur={hide}
          onExec={onExec}
          queryCompletions={queryCompletions}
          initValue={state.initValue}
        />
      );
    } else if (state.promptMode === "find") {
      return (
        <Prompt prefix={"/"} onBlur={hide} onExec={onExec} initValue={""} />
      );
    }
  } else if (state.mode === "info_message") {
    return <InfoMessage>{state.message}</InfoMessage>;
  } else if (state.mode === "error_message") {
    return <ErrorMessage>{state.message}</ErrorMessage>;
  }
  return null;
};

export default Console;
