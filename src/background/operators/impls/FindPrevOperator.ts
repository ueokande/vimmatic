import { inject, injectable } from "inversify";
import { FindUseCase } from "../../usecases/FindUseCase";
import type { Operator, OperatorContext } from "../types";

@injectable()
export class FindPrevOperator implements Operator {
  constructor(
    @inject(FindUseCase)
    private readonly findUseCase: FindUseCase,
  ) {}

  name(): string {
    return "find.prev";
  }

  schema() {}

  async run(ctx: OperatorContext): Promise<void> {
    this.findUseCase.findPrev(ctx.sender.tabId);
  }
}
