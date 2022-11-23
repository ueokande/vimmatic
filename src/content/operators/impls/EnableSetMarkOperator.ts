import { injectable, inject } from "inversify";
import Operator from "../Operator";
import MarkKeyRepository from "../../repositories/MarkKeyRepository";

@injectable()
export default class EnableSetMarkOperator implements Operator {
  constructor(
    @inject("MarkKeyRepository")
    private readonly repository: MarkKeyRepository
  ) {}

  name() {
    return "mark.set.prefix";
  }

  schema() {}

  async run(): Promise<void> {
    this.repository.enableSetMode();
  }
}
