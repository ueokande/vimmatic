import { injectable, inject } from "inversify";
import { CommandController } from "../controllers/CommandController";
import { SettingsController } from "../controllers/SettingsController";
import { OperationController } from "../controllers/OperationController";
import { KeyController } from "../controllers/KeyController";
import { ConsoleController } from "../controllers/ConsoleController";
import { FindController } from "../controllers/FindController";
import type { ConsoleClient } from "../clients/ConsoleClient";
import { ReceiverWithContext } from "../../messaging";
import type { Schema } from "../../messaging/schema/background";
import type { RequestContext } from "./types";

@injectable()
export class BackgroundMessageListener {
  private readonly receiver: ReceiverWithContext<Schema, RequestContext> =
    new ReceiverWithContext();

  constructor(
    @inject(SettingsController)
    settingsController: SettingsController,
    @inject(CommandController)
    commandController: CommandController,
    @inject(OperationController)
    operationController: OperationController,
    @inject(KeyController)
    keyController: KeyController,
    @inject(ConsoleController)
    consoleController: ConsoleController,
    @inject(FindController)
    findController: FindController,
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient,
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
      .to(findController.exec.bind(findController));
    this.receiver
      .route("console.find.completions")
      .to(findController.getCompletions.bind(findController));
    this.receiver
      .route("console.resize")
      .to(consoleController.resize.bind(consoleController));
    this.receiver
      .route("settings.get.property")
      .to(settingsController.getProperty.bind(settingsController));
    this.receiver
      .route("settings.get.style")
      .to(settingsController.getStyle.bind(settingsController));
    this.receiver
      .route("settings.query")
      .to(settingsController.getSettings.bind(settingsController));
    this.receiver
      .route("settings.validate")
      .to(settingsController.validate.bind(settingsController));
    this.receiver
      .route("press.key")
      .to(keyController.pressKey.bind(keyController));
  }

  listen() {
    chrome.runtime.onMessage.addListener(
      (
        message: unknown,
        sender: chrome.runtime.MessageSender,
        sendResponse,
      ) => {
        const ctx: RequestContext = { sender };
        if (typeof message !== "object" && message !== null) {
          // eslint-disable-next-line no-console
          console.warn("unexpected message format:", message);
          return;
        }
        const { type, args } = message as { type: unknown; args: unknown };
        if (
          typeof type !== "string" ||
          (typeof args !== "undefined" && typeof args !== "object")
        ) {
          // eslint-disable-next-line no-console
          console.warn("unexpected message format:", message);
          return;
        }

        if (process.env.NODE_ENV === "development") {
          const style = "background-color: purple; color: white; padding: 4px;";
          // eslint-disable-next-line no-console
          console.debug("%cRECEIVE%c %s %o", style, "", type, args);
        }

        Promise.resolve()
          .then(() => this.receiver.receive(ctx, type, args))
          .then(sendResponse)
          .catch((err) => {
            // eslint-disable-next-line no-console
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
      },
    );
  }
}
