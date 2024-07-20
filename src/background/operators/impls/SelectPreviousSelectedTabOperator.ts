import { inject, injectable } from "inversify";
import type { Operator } from "../types";
import type { LastSelectedTabRepository } from "../../repositories/LastSelectedTabRepository";

@injectable()
export class SelectPreviousSelectedTabOperator implements Operator {
  constructor(
    @inject("LastSelectedTabRepository")
    private readonly lastSelectedTabRepository: LastSelectedTabRepository,
  ) {}

  name() {
    return "tabs.prevsel";
  }

  schema() {}

  async run(): Promise<void> {
    const lastTabId =
      await this.lastSelectedTabRepository.getLastSelectedTabId();
    if (!lastTabId) {
      return;
    }
    await chrome.tabs.update(lastTabId, { active: true });
  }
}
