import { inject, injectable } from "inversify";
import { ConsoleClient } from "../clients/ConsoleClient";
import { HintClient } from "../clients/HintClient";
import { ClipboardRepository } from "../repositories/ClipboardRepository";
import type { ActionResult, HintAction, HintTarget } from "./types";

@injectable()
export class YankLinkTextHintAction implements HintAction {
  constructor(
    @inject(HintClient)
    private readonly hintClient: HintClient,
    @inject(ClipboardRepository)
    private readonly clipboardRepository: ClipboardRepository,
    @inject(ConsoleClient)
    private readonly consoleClient: ConsoleClient,
  ) {}

  description(): string {
    return "Copy link text";
  }

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
  ): Promise<ActionResult | void> {
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
        return element.attributes.alt;
      }
      return undefined;
    })();
    if (!content) {
      await this.consoleClient.showError(tabId, "No content to yank");
      return;
    }

    await this.clipboardRepository.write(content);
    await this.consoleClient.showInfo(tabId, `Yanked ${content}`);
    return { keepConsole: true };
  }
}
