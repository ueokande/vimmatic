import { inject, injectable } from "inversify";
import type { Props, OperatorContext } from "../operators/Operator";
import OperatorRegistory from "../operators/OperatorRegistory";
import RepeatRepository from "../repositories/RepeatRepository";
import RequestContext from "../messaging/RequestContext";

@injectable()
export default class OperationUseCase {
  constructor(
    @inject("OperatorRegistory")
    private readonly operatorRegistory: OperatorRegistory,
    @inject("RepeatRepository")
    private readonly repeatRepository: RepeatRepository
  ) {}

  async run(
    ctx: RequestContext,
    name: string,
    props: Props,
    repeat: number
  ): Promise<void> {
    if (
      typeof ctx.sender.tab?.id === "undefined" ||
      typeof ctx.sender.frameId === "undefined"
    ) {
      return;
    }
    const opCtx: OperatorContext = {
      sender: {
        tabId: ctx.sender.tab.id,
        frameId: ctx.sender.frameId,
        tab: ctx.sender.tab,
      },
    };

    if (this.isRepeatable(name)) {
      await this.repeatRepository.setLastOperation({ type: name, ...props });
    }
    const op = this.operatorRegistory.getOperator(name);
    if (typeof op === "undefined") {
      throw new Error("unknown operation: " + name);
    }

    for (let i = 0; i < repeat; ++i) {
      await op.run(opCtx, props);
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
        return true;
    }
    return false;
  }
}
