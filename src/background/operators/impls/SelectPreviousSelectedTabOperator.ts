import { inject, injectable } from "inversify";
import Operator from "../Operator";
import LastSelectedTabRepository from "../../repositories/LastSelectedTabRepository";

@injectable()
export default class SelectPreviousSelectedTabOperator implements Operator {
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
