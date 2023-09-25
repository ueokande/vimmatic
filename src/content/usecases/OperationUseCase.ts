import { injectable, inject } from "inversify";
import OperationClient from "../client/OperationClient";
import type { Props } from "../../shared/operations2";

@injectable()
export default class OperationUseCase {
  constructor(
    @inject("OperationClient")
    private readonly operationClient: OperationClient,
  ) {}

  async exec(name: string, props: Props, repeat: number): Promise<void> {
    await this.operationClient.execBackgroundOp(name, props, repeat);
  }
}
