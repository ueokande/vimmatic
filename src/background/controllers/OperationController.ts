import { inject, injectable } from "inversify";
import OperationUseCase from "../usecases/OperationUseCase";
import RequestContext from "../infrastructures/RequestContext";

@injectable()
export default class OperationController {
  constructor(
    @inject(OperationUseCase)
    private readonly operationUseCase: OperationUseCase
  ) {}

  async exec(
    ctx: RequestContext,
    {
      repeat,
      name,
      props,
    }: {
      repeat: number;
      name: string;
      props: Record<string, string | number | boolean>;
    }
  ): Promise<void> {
    this.operationUseCase.run(ctx, name, props, repeat);
  }
}
