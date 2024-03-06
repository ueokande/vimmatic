import React from "react";
import Prompt from "./components/Prompt";
import InfoMessage from "./components/InfoMessage";
import ErrorMessage from "./components/ErrorMessage";
import { SimplexReceiver } from "../messaging";
import StyleProvider from "./styles/providers";
import type { Schema as ConsoleMessageSchema } from "../messaging/schema/console";
import {
  useConsoleMode,
  useVisibility,
  useExecCommand,
  useGetCommandCompletion,
  useExecFind,
  useGetFindCompletion,
  useSendReady,
} from "./app/hooks";

// (10item + 1title) * sbc
const COMMAND_COMPLETION_MAX_ITEMS = 33;
const FIND_COMPLETION_MAX_ITEMS = 11;

const App: React.FC = () => {
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
  const sendReady = useSendReady();
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
    [execCommand, execFind, state],
  );

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

    sendReady();
  }, []);

  if (!visible) {
    return null;
  }

  const content = (() => {
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
  })();

  return <StyleProvider>{content}</StyleProvider>;
};

export default App;
