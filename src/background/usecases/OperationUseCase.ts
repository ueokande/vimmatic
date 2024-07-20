import { inject, injectable } from "inversify";
import type { OperatorContext } from "../operators/types";
import type { Operation } from "../../shared/operation";
import type { OperatorRegistory } from "../operators/OperatorRegistory";
import type { RepeatRepository } from "../repositories/RepeatRepository";
import type { RequestContext } from "../messaging/types";

@injectable()
export class OperationUseCase {
  constructor(
    @inject("OperatorRegistory")
    private readonly operatorRegistory: OperatorRegistory,
    @inject("RepeatRepository")
    private readonly repeatRepository: RepeatRepository,
  ) {}

  async run(ctx: RequestContext, op: Operation, repeat: number): Promise<void> {
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

    if (this.isRepeatable(op.type)) {
      await this.repeatRepository.setLastOperation(op);
    }
    const got = this.operatorRegistory.getOperator(op.type);
    if (typeof got === "undefined") {
      throw new Error("unknown operation: " + op.type);
    }

    for (let i = 0; i < repeat; ++i) {
      await got.run(opCtx, op.props);
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
