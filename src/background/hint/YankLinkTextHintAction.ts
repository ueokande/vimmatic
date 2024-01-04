import { injectable, inject } from "inversify";
import type HintClient from "../clients/HintClient";
import type HintTarget from "./HintTarget";
import type HintAction from "./HintAction";
import type ClipboardRepository from "../repositories/ClipboardRepository";
import type ConsoleClient from "../clients/ConsoleClient";

@injectable()
export default class YankLinkTextHintAction implements HintAction {
  constructor(
    @inject("HintClient")
    private readonly hintClient: HintClient,
    @inject("ClipboardRepository")
    private readonly clipboardRepository: ClipboardRepository,
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient,
  ) {}

  lookupTargetSelector(): string {
    return ["a", "area"].join(", ");
  }

  async activate(
    tabId: number,
    target: HintTarget,
    _opts: {
      newTab: boolean;
      background: boolean;
    },
  ): Promise<void> {
    const element = await this.hintClient.getElement(
      tabId,
      target.frameId,
      target.element,
    );
    if (!element) {
      return;
    }

    const content = (() => {
      if (element.tagName.toLowerCase() === "a") {
        return element.textContent;
      } else if (element.tagName.toLowerCase() === "area") {
        return element.attributes["alt"];
      }
      return undefined;
    })();
    if (!content) {
      await this.consoleClient.showError(tabId, "No content to yank");
      return;
    }

    await this.clipboardRepository.write(content);
    await this.consoleClient.showInfo(tabId, "Yanked " + content);
  }
}
