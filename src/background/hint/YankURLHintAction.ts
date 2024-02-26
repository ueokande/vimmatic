import { injectable, inject } from "inversify";
import type HintClient from "../clients/HintClient";
import type { HintTarget, HintAction } from "./types";
import type ClipboardRepository from "../repositories/ClipboardRepository";
import type ConsoleClient from "../clients/ConsoleClient";

@injectable()
export default class YankUrlHintAction implements HintAction {
  constructor(
    @inject("HintClient")
    private readonly hintClient: HintClient,
    @inject("ClipboardRepository")
    private readonly clipboardRepository: ClipboardRepository,
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient,
  ) {}

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
