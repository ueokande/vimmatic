import Console from "./components/Console";
import { SimplexReceiver } from "../messaging";
import type { Schema as ConsoleMessageSchema } from "../messaging/schema/console";
import React from "react";
import { useConsoleMode, useVisibility } from "./app/hooks";
import { useColorSchemeRefresh } from "./colorscheme/hooks";

const App: React.FC = () => {
  const refreshColorScheme = useColorSchemeRefresh();
  const { hide, visible } = useVisibility();
  const {
    showCommandPrompt,
    showFindPrompt,
    showInfoMessage,
    showErrorMessage,
  } = useConsoleMode();

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

  return <Console />;
};

export default App;
