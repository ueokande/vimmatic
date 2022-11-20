import { inject, injectable } from "inversify";
import Operator from "../Operator";
import OperatorFactoryChain from "../OperatorFactoryChain";
import * as operations from "../../../shared/operations";
import FindNextOperator from "./FindNextOperator";
import FindPrevOperator from "./FindPrevOperator";
import FindRepository from "../../repositories/FindRepository";
import FindClient from "../../clients/FindClient";
import ConsoleClient from "../../clients/ConsoleClient";
import ReadyFrameRepository from "../../repositories/ReadyFrameRepository";

@injectable()
export default class FindOperatorFactoryChain implements OperatorFactoryChain {
  constructor(
    @inject("FindRepository")
    private readonly findRepository: FindRepository,
    @inject("FindClient")
    private readonly findClient: FindClient,
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient,
    @inject("ReadyFrameRepository")
    private readonly frameRepository: ReadyFrameRepository
  ) {}

  create(op: operations.Operation): Operator | null {
    switch (op.type) {
      case operations.FIND_NEXT:
        return new FindNextOperator(
          this.findRepository,
          this.findClient,
          this.consoleClient,
          this.frameRepository
        );
      case operations.FIND_PREV:
        return new FindPrevOperator(
          this.findRepository,
          this.findClient,
          this.consoleClient,
          this.frameRepository
        );
    }
    return null;
  }
}
