import { inject, injectable } from "inversify";
import { ConsoleClient } from "../clients/ConsoleClient";
import { HintClient } from "../clients/HintClient";
import { ClipboardRepository } from "../repositories/ClipboardRepository";
import type { ActionResult, HintAction, HintTarget } from "./types";

@injectable()
export class YankURLHintAction implements HintAction {
  constructor(
    @inject(HintClient)
    private readonly hintClient: HintClient,
    @inject(ClipboardRepository)
    private readonly clipboardRepository: ClipboardRepository,
    @inject(ConsoleClient)
    private readonly consoleClient: ConsoleClient,
  ) {}

  description(): string {
    return "Copy link URL";
  }

  lookupTargetSelector(): string {
    return ["a", "area"].join(",");
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

    const href = element.href;
    if (!href) {
      return;
    }

    await this.clipboardRepository.write(href);
    await this.consoleClient.showInfo(tabId, `Yanked ${href}`);
    return { keepConsole: true };
  }
}
