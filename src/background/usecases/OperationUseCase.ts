import { inject, injectable } from "inversify";
import type { Props } from "../operators/Operator";
import OperatorRegistory from "../operators/OperatorRegistory";
import RepeatRepository from "../repositories/RepeatRepository";

@injectable()
export default class OperationUseCase {
  constructor(
    @inject("OperatorRegistory")
    private readonly operatorRegistory: OperatorRegistory,
    @inject("RepeatRepository")
    private readonly repeatRepository: RepeatRepository
  ) {}

  async run(name: string, props: Props, repeat: number): Promise<void> {
    if (this.isRepeatable(name)) {
      this.repeatRepository.setLastOperation({ type: name, ...props });
    }
    const op = this.operatorRegistory.getOperator(name);
    if (typeof op === "undefined") {
      throw new Error("unknown operation: " + name);
    }

    for (let i = 0; i < repeat; ++i) {
      await op.run(props);
    }
  }

  private isRepeatable(name: string): boolean {
    switch (name) {
      case "navigate.history.prev":
      case "navigate.history.next":
      case "navigate.link.prev":
      case "navigate.link.next":
      case "navigate.parent":
      case "navigate.root":
      case "page.source":
      case "page.home":
      case "tabs.close":
      case "tabs.close.force":
      case "tabs.reopen":
      case "tabs.reload":
      case "tabs.pin":
      case "tabs.unpin":
      case "tabs.toggle.pinned":
      case "tabs.duplicate":
      case "zoom.in":
      case "zoom.out":
      case "zoom.reset":
      case "internal.open.url":
        return true;
    }
    return false;
  }
}
