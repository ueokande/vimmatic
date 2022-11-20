import { inject, injectable } from "inversify";
import Operator from "../Operator";
import OperatorFactoryChain from "../OperatorFactoryChain";
import CancelOperator from "./CancelOperator";
import InternalOpenURLOperator from "./InternalOpenURLOperator";
import ConsoleClient from "../../clients/ConsoleClient";
import * as operations from "../../../shared/operations";

@injectable()
export default class InternalOperatorFactoryChain
  implements OperatorFactoryChain
{
  constructor(
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient
  ) {}

  create(op: operations.Operation): Operator | null {
    switch (op.type) {
      case operations.CANCEL:
        return new CancelOperator(this.consoleClient);
      case operations.INTERNAL_OPEN_URL:
        return new InternalOpenURLOperator(op.url, op.newTab, op.newWindow);
    }
    return null;
  }
}
