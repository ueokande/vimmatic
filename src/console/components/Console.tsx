import React from "react";
import Prompt from "./Prompt";
import InfoMessage from "./InfoMessage";
import ErrorMessage from "./ErrorMessage";
import { useConsoleMode } from "../app/hooks";
import {
  useExecCommand,
  useGetCommandCompletion,
  useExecFind,
  useGetFindCompletion,
  useVisibility,
} from "../app/hooks";

const Console: React.FC = () => {
  const { hide } = useVisibility();
  const { state } = useConsoleMode();
  const execCommand = useExecCommand();
  const execFind = useExecFind();
  const getCommandCompletions = useGetCommandCompletion();
  const getFindCompletions = useGetFindCompletion();

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

  if (state.mode === "prompt") {
    if (state.promptMode === "command") {
      return (
        <Prompt
          prefix={":"}
          onBlur={hide}
          onExec={onExec}
          queryCompletions={getCommandCompletions}
          initValue={state.initValue}
        />
      );
    } else if (state.promptMode === "find") {
      return (
        <Prompt
          prefix={"/"}
          onBlur={hide}
          onExec={onExec}
          queryCompletions={getFindCompletions}
          initValue={state.initValue}
        />
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
