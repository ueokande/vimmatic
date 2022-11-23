import { inject, injectable } from "inversify";
import RequestContext from "./RequestContext";
import OperationUseCase from "../usecases/OperationUseCase";

@injectable()
export default class OperationController {
  constructor(
    @inject(OperationUseCase)
    private readonly operationUseCase: OperationUseCase
  ) {}

  async exec(
    _ctx: RequestContext,
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
    this.operationUseCase.run(name, props, repeat);
  }
}
