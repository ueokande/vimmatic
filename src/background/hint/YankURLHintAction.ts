import { injectable, inject } from "inversify";
import { HintClient } from "../clients/HintClient";
import type { HintTarget, HintAction } from "./types";
import { ClipboardRepository } from "../repositories/ClipboardRepository";
import { ConsoleClient } from "../clients/ConsoleClient";

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
  ): Promise<void> {
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
    await this.consoleClient.showInfo(tabId, "Yanked " + href);
  }
}
