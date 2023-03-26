import { injectable, inject } from "inversify";
import CommandController from "../controllers/CommandController";
import SettingsController from "../controllers/SettingsController";
import LinkController from "../controllers/LinkController";
import OperationController from "../controllers/OperationController";
import KeyController from "../controllers/KeyController";
import ConsoleController from "../controllers/ConsoleController";
import FindController from "../controllers/FindController";
import ConsoleClient from "../clients/ConsoleClient";
import { ReceiverWithContext } from "../../messaging";
import type { Schema } from "../../messaging/schema/background";
import RequestContext from "./RequestContext";

@injectable()
export default class BackgroundMessageListener {
  private readonly receiver: ReceiverWithContext<Schema, RequestContext> =
    new ReceiverWithContext();

  private readonly consolePorts: { [tabId: number]: chrome.runtime.Port } = {};

  constructor(
    @inject(SettingsController)
    settingsController: SettingsController,
    @inject(CommandController)
    commandController: CommandController,
    @inject(LinkController)
    linkController: LinkController,
    @inject(OperationController)
    operationController: OperationController,
    @inject(KeyController)
    keyController: KeyController,
    @inject(ConsoleController)
    consoleController: ConsoleController,
    @inject(FindController)
    findController: FindController,
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient
  ) {
    this.receiver
      .route("background.operation")
      .to(operationController.exec.bind(operationController));
    this.receiver
      .route("console.command.enter")
      .to(commandController.exec.bind(commandController));
    this.receiver
      .route("console.command.completions")
      .to(commandController.getCompletions.bind(commandController));
    this.receiver
      .route("console.find.enter")
      .to(findController.startFind.bind(findController));
    this.receiver
      .route("console.resize")
      .to(consoleController.resize.bind(consoleController));
    this.receiver
      .route("open.url")
      .to(linkController.openURL.bind(linkController));
    this.receiver
      .route("settings.get.property")
      .to(settingsController.getProperty.bind(settingsController));
    this.receiver
      .route("settings.query")
      .to(settingsController.getSettings.bind(settingsController));
    this.receiver
      .route("settings.validate")
      .to(settingsController.validate.bind(settingsController));
    this.receiver
      .route("console.frame.message")
      .to(this.onConsoleFrameMessage.bind(this));
    this.receiver
      .route("press.key")
      .to(keyController.pressKey.bind(keyController));
  }

  listen() {
    chrome.runtime.onMessage.addListener(
      (
        message: unknown,
        sender: chrome.runtime.MessageSender,
        sendResponse
      ) => {
        const ctx: RequestContext = { sender };
        if (typeof message !== "object" && message !== null) {
          console.warn("unexpected message format:", message);
          return;
        }
        const { type, args } = message as { type: unknown; args: unknown };
        if (
          typeof type !== "string" ||
          (typeof args !== "undefined" && typeof args !== "object")
        ) {
          console.warn("unexpected message format:", message);
          return;
        }

        if (process.env.NODE_ENV === "development") {
          const style = "background-color: purple; color: white; padding: 4px;";
          console.debug("%cRECEIVE%c %s %o", style, "", type, args);
        }

        Promise.resolve()
          .then(() => this.receiver.receive(ctx, type, args))
          .then(sendResponse)
          .catch((err) => {
            console.error(err);
            if (!sender.tab || !sender.tab.id) {
              return;
            }
            if (typeof err.message !== "string") {
              return;
            }
            this.consoleClient.showError(sender.tab.id, err.message);
          });
        return true;
      }
    );
    chrome.runtime.onConnect.addListener(this.onConnected.bind(this));
  }

  private onConnected(port: chrome.runtime.Port): void {
    if (port.name !== "vimmatic-console") {
      return;
    }

    if (port.sender && port.sender.tab && port.sender.tab.id) {
      const id = port.sender.tab.id;
      this.consolePorts[id] = port;
    }
  }

  private onConsoleFrameMessage(
    { sender }: RequestContext,
    message: any
  ): void {
    if (typeof sender.tab?.id === "undefined") {
      return;
    }
    const port = this.consolePorts[sender.tab?.id];
    if (!port) {
      return;
    }
    port.postMessage(message);
  }
}
