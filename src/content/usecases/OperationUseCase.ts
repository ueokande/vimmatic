import { injectable, inject } from "inversify";
import OperatorRegistory from "../operators/OperatorRegistory";
import OperationClient from "../client/OperationClient";
import type { Props } from "../../shared/operations2";

@injectable()
export default class OperationUseCase {
  constructor(
    @inject("OperatorRegistory")
    private readonly operatorRegistory: OperatorRegistory,
    @inject("OperationClient")
    private readonly operationClient: OperationClient
  ) {}

  async exec(name: string, props: Props, repeat: number): Promise<void> {
    const op = this.operatorRegistory.getOperator(name);
    if (typeof op === "undefined") {
      await this.operationClient.execBackgroundOp(name, props, repeat);
      return;
    }

    const schema = op.schema();
    if (typeof schema !== "undefined") {
      schema.parse(props);
    }
    for (let i = 0; i < repeat; i++) {
      await op.run(props);
    }
  }
}
