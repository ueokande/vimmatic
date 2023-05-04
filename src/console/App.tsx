import React from "react";
import Prompt from "./components/Prompt";
import InfoMessage from "./components/InfoMessage";
import ErrorMessage from "./components/ErrorMessage";
import { SimplexReceiver } from "../messaging";
import type { Schema as ConsoleMessageSchema } from "../messaging/schema/console";
import {
  useConsoleMode,
  useVisibility,
  useExecCommand,
  useGetCommandCompletion,
  useExecFind,
  useGetFindCompletion,
} from "./app/hooks";
import { useColorSchemeRefresh } from "./colorscheme/hooks";

// (10item + 1title) * sbc
const COMMAND_COMPLETION_MAX_ITEMS = 33;
const FIND_COMPLETION_MAX_ITEMS = 11;

const App: React.FC = () => {
  const refreshColorScheme = useColorSchemeRefresh();
  const { hide, visible } = useVisibility();
  const {
    state,
    showCommandPrompt,
    showFindPrompt,
    showInfoMessage,
    showErrorMessage,
  } = useConsoleMode();
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
      hide();
    },
    [execCommand, execFind, state]
  );

  React.useEffect(() => {
    if (visible) {
      refreshColorScheme();
    }
  }, [visible]);

  React.useEffect(() => {
    const receiver = new SimplexReceiver<ConsoleMessageSchema>();
    receiver
      .route("console.show.command")
      .to(({ command }) => showCommandPrompt(command));
    receiver.route("console.show.find").to(() => showFindPrompt());
    receiver
      .route("console.show.error")
      .to(({ text }) => showErrorMessage(text));
    receiver.route("console.show.info").to(({ text }) => showInfoMessage(text));
    receiver.route("console.hide").to(() => hide());
    chrome.runtime.onMessage.addListener((message: any) => {
      receiver.receive(message.type, message.args);
    });
    const port = chrome.runtime.connect({ name: "vimmatic-console" });
    port.onMessage.addListener((message: any) => {
      receiver.receive(message.type, message.args);
    });
  }, []);

  if (state.mode === "prompt") {
    if (state.promptMode === "command") {
      return (
        <Prompt
          prefix={":"}
          maxLineHeight={COMMAND_COMPLETION_MAX_ITEMS}
          onExec={onExec}
          queryCompletions={getCommandCompletions}
          initValue={state.initValue}
          onBlur={hide}
        />
      );
    } else if (state.promptMode === "find") {
      return (
        <Prompt
          prefix={"/"}
          maxLineHeight={FIND_COMPLETION_MAX_ITEMS}
          onExec={onExec}
          queryCompletions={getFindCompletions}
          initValue={state.initValue}
          onBlur={hide}
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

export default App;
