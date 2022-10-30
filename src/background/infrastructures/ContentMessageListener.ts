import { injectable, inject } from "inversify";
import * as messages from "../../shared/messages";
import * as operations from "../../shared/operations";
import CommandController from "../controllers/CommandController";
import SettingController from "../controllers/SettingController";
import AddonEnabledController from "../controllers/AddonEnabledController";
import LinkController from "../controllers/LinkController";
import OperationController from "../controllers/OperationController";
import MarkController from "../controllers/MarkController";
import CompletionController from "../controllers/CompletionController";
import ConsoleController from "../controllers/ConsoleController";
import FindController from "../controllers/FindController";

@injectable()
export default class ContentMessageListener {
  private readonly consolePorts: { [tabId: number]: browser.runtime.Port } = {};

  constructor(
    @inject(SettingController)
    private readonly settingController: SettingController,
    @inject(CommandController)
    private readonly commandController: CommandController,
    @inject(CompletionController)
    private readonly completionController: CompletionController,
    @inject(AddonEnabledController)
    private readonly addonEnabledController: AddonEnabledController,
    @inject(LinkController)
    private readonly linkController: LinkController,
    @inject(OperationController)
    private readonly operationController: OperationController,
    @inject(MarkController)
    private readonly markController: MarkController,
    @inject(ConsoleController)
    private readonly consoleController: ConsoleController,
    @inject(FindController)
    private readonly findController: FindController
  ) {}

  run(): void {
    browser.runtime.onMessage.addListener(
      (message: any, sender: browser.runtime.MessageSender) => {
        try {
          const ret = this.onMessage(message, sender.tab as browser.tabs.Tab);
          if (!(ret instanceof Promise)) {
            return Promise.resolve({});
          }
          return ret.catch((e) => {
            console.error(e);
            if (!sender.tab || !sender.tab.id) {
              return;
            }
            return browser.tabs.sendMessage(sender.tab.id, {
              type: messages.CONSOLE_SHOW_ERROR,
              text: e.message,
            });
          });
        } catch (e) {
          console.error(e);
          if (!sender.tab || !sender.tab.id) {
            return;
          }
          return browser.tabs.sendMessage(sender.tab.id, {
            type: messages.CONSOLE_SHOW_ERROR,
            text: e.message,
          });
        }
      }
    );
    browser.runtime.onConnect.addListener(this.onConnected.bind(this));
  }

  onMessage(
    message: messages.Message,
    senderTab: browser.tabs.Tab
  ): Promise<unknown> | unknown {
    switch (message.type) {
      case messages.CONSOLE_GET_COMPLETION_TYPES:
        return this.completionController.getCompletionTypes();
      case messages.CONSOLE_REQUEST_SEARCH_ENGINES_MESSAGE:
        return this.completionController.requestSearchEngines(message.query);
      case messages.CONSOLE_REQUEST_BOOKMARKS:
        return this.completionController.requestBookmarks(message.query);
      case messages.CONSOLE_REQUEST_HISTORY:
        return this.completionController.requestHistory(message.query);
      case messages.CONSOLE_REQUEST_TABS:
        return this.completionController.queryTabs(
          message.query,
          message.excludePinned
        );
      case messages.CONSOLE_GET_PROPERTIES:
        return this.completionController.getProperties();
      case messages.CONSOLE_ENTER_COMMAND:
        return this.onConsoleEnterCommand(message.text);
      case messages.CONSOLE_ENTER_FIND:
        return this.findController.startFind(senderTab.id!, message.keyword);
      case messages.CONSOLE_RESIZE:
        return this.onConsoleResize(
          senderTab.id!,
          message.width,
          message.height
        );
      case messages.SETTINGS_QUERY:
        return this.onSettingsQuery();
      case messages.ADDON_ENABLED_RESPONSE:
        return this.onAddonEnabledResponse(message.enabled);
      case messages.OPEN_URL:
        return this.onOpenUrl(
          message.newTab,
          message.url,
          senderTab.id as number,
          message.background
        );
      case messages.BACKGROUND_OPERATION:
        return this.onBackgroundOperation(message.repeat, message.operation);
      case messages.MARK_SET_GLOBAL:
        return this.onMarkSetGlobal(message.key, message.x, message.y);
      case messages.MARK_JUMP_GLOBAL:
        return this.onMarkJumpGlobal(message.key);
      case messages.CONSOLE_FRAME_MESSAGE:
        return this.onConsoleFrameMessage(
          senderTab.id as number,
          message.message
        );
    }
    throw new Error("unsupported message: " + message.type);
  }

  onConsoleEnterCommand(text: string): Promise<unknown> {
    return this.commandController.exec(text);
  }

  onConsoleResize(
    senderTabId: number,
    width: number,
    height: number
  ): Promise<void> {
    return this.consoleController.resize(senderTabId, width, height);
  }

  async onSettingsQuery(): Promise<unknown> {
    return (await this.settingController.getSetting()).toJSON();
  }

  onAddonEnabledResponse(enabled: boolean): Promise<void> {
    return this.addonEnabledController.indicate(enabled);
  }

  onOpenUrl(
    newTab: boolean,
    url: string,
    openerId: number,
    background: boolean
  ): Promise<void> {
    if (newTab) {
      return this.linkController.openNewTab(url, openerId, background);
    }
    return this.linkController.openToTab(url, openerId);
  }

  onBackgroundOperation(
    count: number,
    op: operations.Operation
  ): Promise<void> {
    return this.operationController.exec(count, op);
  }

  onMarkSetGlobal(key: string, x: number, y: number): Promise<void> {
    return this.markController.setGlobal(key, x, y);
  }

  onMarkJumpGlobal(key: string): Promise<void> {
    return this.markController.jumpGlobal(key);
  }

  onConsoleFrameMessage(tabId: number, message: any): void {
    const port = this.consolePorts[tabId];
    if (!port) {
      return;
    }
    port.postMessage(message);
  }

  onConnected(port: browser.runtime.Port): void {
    if (port.name !== "vimmatic-console") {
      return;
    }

    if (port.sender && port.sender.tab && port.sender.tab.id) {
      const id = port.sender.tab.id;
      this.consolePorts[id] = port;
    }
  }
}
