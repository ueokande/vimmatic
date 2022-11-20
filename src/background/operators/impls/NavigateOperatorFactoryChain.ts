import { inject, injectable } from "inversify";
import Operator from "../Operator";
import OperatorFactoryChain from "../OperatorFactoryChain";
import NavigateHistoryPrevOperator from "./NavigateHistoryPrevOperator";
import NavigateHistoryNextOperator from "./NavigateHistoryNextOperator";
import NavigateLinkPrevOperator from "./NavigateLinkPrevOperator";
import NavigateLinkNextOperator from "./NavigateLinkNextOperator";
import NavigateParentOperator from "./NavigateParentOperator";
import NavigateRootOperator from "./NavigateRootOperator";
import OpenSourceOperator from "./OpenSourceOperator";
import OpenHomeOperator from "./OpenHomeOperator";
import NavigateClient from "../../clients/NavigateClient";
import BrowserSettingRepository from "../../repositories/BrowserSettingRepository";
import * as operations from "../../../shared/operations";

@injectable()
export default class NavigateOperatorFactoryChain
  implements OperatorFactoryChain
{
  constructor(
    @inject("NavigateClient")
    private readonly navigateClient: NavigateClient,
    @inject("BrowserSettingRepository")
    private readonly browserSettingRepository: BrowserSettingRepository
  ) {}

  create(op: operations.Operation): Operator | null {
    switch (op.type) {
      case operations.NAVIGATE_HISTORY_PREV:
        return new NavigateHistoryPrevOperator(this.navigateClient);
      case operations.NAVIGATE_HISTORY_NEXT:
        return new NavigateHistoryNextOperator(this.navigateClient);
      case operations.NAVIGATE_LINK_PREV:
        return new NavigateLinkPrevOperator(this.navigateClient);
      case operations.NAVIGATE_LINK_NEXT:
        return new NavigateLinkNextOperator(this.navigateClient);
      case operations.NAVIGATE_PARENT:
        return new NavigateParentOperator();
      case operations.NAVIGATE_ROOT:
        return new NavigateRootOperator();
      case operations.PAGE_SOURCE:
        return new OpenSourceOperator();
      case operations.PAGE_HOME:
        return new OpenHomeOperator(this.browserSettingRepository, op.newTab);
    }
    return null;
  }
}
