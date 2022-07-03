import { injectable, inject } from "inversify";
import Operator from "../Operator";
import OperatorFactory from "../OperatorFactory";
import OperatorFactoryChain from "../OperatorFactoryChain";
import CommandOperatorFactoryChain from "./CommandOperatorFactoryChain";
import InternalOperatorFactoryChain from "./InternalOperatorFactoryChain";
import NavigateOperatorFactoryChain from "./NavigateOperatorFactoryChain";
import RepeatOperatorFactoryChain from "./RepeatOperatorFactoryChain";
import TabOperatorFactoryChain from "./TabOperatorFactoryChain";
import ZoomOperatorFactoryChain from "./ZoomOperatorFactoryChain";
import FindOperatorFactoryChain from "./FindOperatorFactoryChain";
import RepeatRepository from "../../repositories/RepeatRepository";
import * as operations from "../../../shared/operations";

@injectable()
export class OperatorFactoryImpl implements OperatorFactory {
  private readonly factoryChains: OperatorFactoryChain[];

  constructor(
    @inject(CommandOperatorFactoryChain)
    commandOperatorFactoryChain: CommandOperatorFactoryChain,
    @inject(InternalOperatorFactoryChain)
    internalOperatorFactoryChain: InternalOperatorFactoryChain,
    @inject(NavigateOperatorFactoryChain)
    navigateOperatorFactoryChain: NavigateOperatorFactoryChain,
    @inject(TabOperatorFactoryChain)
    tabOperatorFactoryChain: TabOperatorFactoryChain,
    @inject(ZoomOperatorFactoryChain)
    zoomOperatorFactoryChain: ZoomOperatorFactoryChain,
    @inject(FindOperatorFactoryChain)
    findOperatorFactoryChain: FindOperatorFactoryChain,
    @inject("RepeatRepository")
    repeatRepository: RepeatRepository
  ) {
    this.factoryChains = [
      commandOperatorFactoryChain,
      internalOperatorFactoryChain,
      navigateOperatorFactoryChain,
      new RepeatOperatorFactoryChain(repeatRepository, this),
      tabOperatorFactoryChain,
      zoomOperatorFactoryChain,
      findOperatorFactoryChain,
    ];
  }

  create(op: operations.Operation): Operator {
    for (const chain of this.factoryChains) {
      const operator = chain.create(op);
      if (operator !== null) {
        return operator;
      }
    }
    throw new Error("unknown operation: " + op.type);
  }
}
