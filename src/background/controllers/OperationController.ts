import { inject, injectable } from "inversify";
import OperatorFactory from "../operators/OperatorFactory";
import RepeatUseCase from "../usecases/RepeatUseCase";
import RequestContext from "./RequestContext";

@injectable()
export default class OperationController {
  constructor(
    @inject(RepeatUseCase)
    private readonly repeatUseCase: RepeatUseCase,
    @inject("OperatorFactory")
    private readonly operatorFactory: OperatorFactory
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
    await this.doOperation(repeat, name, props);
    if (this.repeatUseCase.isRepeatable(name)) {
      this.repeatUseCase.storeLastOperation(name, props);
    }
  }

  private async doOperation(
    repeat: number,
    name: string,
    props: Record<string, string | number | boolean>
  ): Promise<void> {
    const operator = this.operatorFactory.create({
      type: name as any,
      ...props,
    });
    for (let i = 0; i < repeat; ++i) {
      // eslint-disable-next-line no-await-in-loop
      await operator.run();
    }
  }
}
