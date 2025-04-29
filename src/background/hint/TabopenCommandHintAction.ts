import { injectable, inject } from "inversify";
import { HintClient } from "../clients/HintClient";
import type { HintTarget, HintAction, ActionResult } from "./types";
import { ConsoleClient } from "../clients/ConsoleClient";

@injectable()
export class TabopenCommandHintAction implements HintAction {
  constructor(
    @inject(HintClient)
    private readonly hintClient: HintClient,
    @inject(ConsoleClient)
    private readonly consoleClient: ConsoleClient,
  ) {}

  description(): string {
    return "Show tabopen command";
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

    await this.consoleClient.showCommand(tabId, "tabopen " + href);

    return { keepConsole: true };
  }
}
