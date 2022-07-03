import { inject, injectable } from "inversify";
import OperatorFactory from "../OperatorFactory";
import BackgroundOperationOperator from "./BackgroundOperationOperator";
import Operator from "../Operator";
import OperatorFactoryChain from "../OperatorFactoryChain";
import { Operation } from "../../../shared/operations";
import OperationClient from "../../client/OperationClient";
import AddonOperatorFactoryChain from "./AddonOperatorFactoryChain";
import ClipboardOperatorFactoryChain from "./ClipboardOperatorFactoryChain";
import FocusOperatorFactoryChain from "./FocusOperatorFactoryChain";
import FollowOperatorFactoryChain from "./FollowOperatorFactoryChain";
import MarkOperatorFactoryChain from "./MarkOperatorFactoryChain";
import ScrollOperatorFactoryChain from "./ScrollOperatorFactoryChain";

@injectable()
export default class OperatorFactoryImpl implements OperatorFactory {
  private readonly factoryChains: OperatorFactoryChain[];

  constructor(
    @inject(AddonOperatorFactoryChain)
    addonOperatorFactoryChain: AddonOperatorFactoryChain,
    @inject(ClipboardOperatorFactoryChain)
    clipboardOperatorFactoryChain: ClipboardOperatorFactoryChain,
    @inject(FocusOperatorFactoryChain)
    focusOperatorFactoryChain: FocusOperatorFactoryChain,
    @inject(FollowOperatorFactoryChain)
    followOperatorFactoryChain: FollowOperatorFactoryChain,
    @inject(MarkOperatorFactoryChain)
    markOperatorFactoryChain: MarkOperatorFactoryChain,
    @inject(ScrollOperatorFactoryChain)
    scrollOperatorFactoryChain: ScrollOperatorFactoryChain,
    @inject("OperationClient")
    private readonly operationClient: OperationClient
  ) {
    this.factoryChains = [
      addonOperatorFactoryChain,
      clipboardOperatorFactoryChain,
      focusOperatorFactoryChain,
      followOperatorFactoryChain,
      markOperatorFactoryChain,
      scrollOperatorFactoryChain,
    ];
  }

  create(op: Operation, repeat: number): Operator {
    for (const chain of this.factoryChains) {
      const operator = chain.create(op, repeat);
      if (operator != null) {
        return operator;
      }
    }
    return new BackgroundOperationOperator(this.operationClient, repeat, op);
  }
}
