import { inject, injectable } from "inversify";
import type { Operator, OperatorContext } from "../types";
import FindUseCase from "../../usecases/FindUseCase";

@injectable()
export default class FindNextOperator implements Operator {
  constructor(
    @inject(FindUseCase)
    private readonly findUseCase: FindUseCase,
  ) {}

  name(): string {
    return "find.next";
  }

  schema() {}

  async run(ctx: OperatorContext): Promise<void> {
    this.findUseCase.findNext(ctx.sender.tabId);
  }
}
