import { injectable, inject } from "inversify";
import CommandController from "../controllers/CommandController";
import SettingsController from "../controllers/SettingsController";
import AddonEnabledController from "../controllers/AddonEnabledController";
import LinkController from "../controllers/LinkController";
import OperationController from "../controllers/OperationController";
import MarkController from "../controllers/MarkController";
import ConsoleController from "../controllers/ConsoleController";
import FindController from "../controllers/FindController";
import { ReceiverWithContext } from "../../messaging";
import type { Schema } from "../../messaging/schema/background";
import RequestContext from "./RequestContext";

@injectable()
export default class BackgroundMessageListener {
  private readonly receiver: ReceiverWithContext<Schema, RequestContext> =
    new ReceiverWithContext();

  private readonly consolePorts: { [tabId: number]: browser.runtime.Port } = {};

  constructor(
    @inject(SettingsController)
    settingsController: SettingsController,
    @inject(CommandController)
    commandController: CommandController,
    @inject(AddonEnabledController)
    addonEnabledController: AddonEnabledController,
    @inject(LinkController)
    linkController: LinkController,
    @inject(OperationController)
    operationController: OperationController,
    @inject(MarkController)
    markController: MarkController,
    @inject(ConsoleController)
    consoleController: ConsoleController,
    @inject(FindController)
    findController: FindController
  ) {
    this.receiver
      .route("addon.enabled.response")
      .to(addonEnabledController.indicate.bind(addonEnabledController));
    this.receiver
      .route("background.operation")
      .to(operationController.exec.bind(operationController));
    this.receiver
      .route("console.enter.command")
      .to(commandController.exec.bind(commandController));
    this.receiver
      .route("console.enter.find")
      .to(findController.startFind.bind(findController));
    this.receiver
      .route("console.get.completions")
      .to(commandController.getCompletions.bind(commandController));
    this.receiver
      .route("console.resize")
      .to(consoleController.resize.bind(consoleController));
    this.receiver
      .route("mark.jump.global")
      .to(markController.jumpGlobal.bind(markController));
    this.receiver
      .route("mark.set.global")
      .to(markController.setGlobal.bind(markController));
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
  }

  listen() {
    browser.runtime.onMessage.addListener(
      (message: unknown, sender: browser.runtime.MessageSender) => {
        const ctx = { sender };
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

        try {
          const ret = this.receiver.receive(ctx, type, args);
          if (!(ret instanceof Promise)) {
            return Promise.resolve({});
          }
          return ret.catch((e) => {
            console.error(e);
            if (!sender.tab || !sender.tab.id) {
              return;
            }
            return this.errorHandler(sender, e);
          });
        } catch (e) {
          return this.errorHandler(sender, e);
        }
      }
    );
    browser.runtime.onConnect.addListener(this.onConnected.bind(this));
  }

  private onConnected(port: browser.runtime.Port): void {
    if (port.name !== "vimmatic-console") {
      return;
    }

    if (port.sender && port.sender.tab && port.sender.tab.id) {
      const id = port.sender.tab.id;
      this.consolePorts[id] = port;
    }
  }

  private onConsoleFrameMessage(ctx: RequestContext, message: any): void {
    const tabId = ctx.sender.tab?.id;
    if (!tabId) {
      return;
    }
    const port = this.consolePorts[tabId];
    if (!port) {
      return;
    }
    port.postMessage(message);
  }

  private errorHandler(
    sender: browser.runtime.MessageSender,
    err: Error
  ): Promise<void> | void {
    console.error(err);
    if (!sender.tab || !sender.tab.id) {
      return;
    }
    return browser.tabs.sendMessage(sender.tab.id, {
      type: "console.show.error",
      text: err.message,
    });
  }
}
