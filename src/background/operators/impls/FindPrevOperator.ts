import { inject, injectable } from "inversify";
import type Operator from "../Operator";
import type { OperatorContext } from "../Operator";
import FindUseCase from "../../usecases/FindUseCase";

@injectable()
export default class FindPrevOperator implements Operator {
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
