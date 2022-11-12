import Console from "./components/Console";
import { SimplexReceiver } from "../messaging";
import type { Schema as ConsoleMessageSchema } from "../messaging/schema/console";
import React from "react";
import {
  useCommandMode,
  useFindMode,
  useInfoMessage,
  useErrorMessage,
  useHide,
} from "./app/hooks";

const App: React.FC = () => {
  const hide = useHide();
  const { show: showCommand } = useCommandMode();
  const { show: showFind } = useFindMode();
  const { show: showError } = useErrorMessage();
  const { show: showInfo } = useInfoMessage();

  React.useEffect(() => {
    const receiver = new SimplexReceiver<ConsoleMessageSchema>();
    receiver
      .route("console.show.command")
      .to(({ command }) => showCommand(command));
    receiver.route("console.show.find").to(() => showFind());
    receiver.route("console.show.error").to(({ text }) => showError(text));
    receiver.route("console.show.info").to(({ text }) => showInfo(text));
    receiver.route("console.hide").to(() => hide());
    browser.runtime.onMessage.addListener((message: any) => {
      receiver.receive(message.type, message.args);
    });
    const port = browser.runtime.connect(undefined, {
      name: "vimmatic-console",
    });
    port.onMessage.addListener((message: any) => {
      receiver.receive(message.type, message.args);
    });
  }, []);

  return <Console />;
};

export default App;
