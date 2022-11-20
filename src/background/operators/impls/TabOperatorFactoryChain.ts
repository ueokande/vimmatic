import { injectable, inject } from "inversify";
import OperatorFactoryChain from "../OperatorFactoryChain";
import * as operations from "../../../shared/operations";
import Operator from "../Operator";
import CloseTabOperator from "./CloseTabOperator";
import CloseTabRightOperator from "./CloseTabRightOperator";
import ReopenTabOperator from "./ReopenTabOperator";
import SelectTabPrevOperator from "./SelectTabPrevOperator";
import SelectTabNextOperator from "./SelectTabNextOperator";
import SelectFirstTabOperator from "./SelectFirstTabOperator";
import SelectLastTabOperator from "./SelectLastTabOperator";
import SelectPreviousSelectedTabOperator from "./SelectPreviousSelectedTabOperator";
import ReloadTabOperator from "./ReloadTabOperator";
import PinTabOperator from "./PinTabOperator";
import UnpinTabOperator from "./UnpinTabOperator";
import TogglePinnedTabOperator from "./TogglePinnedTabOperator";
import DuplicateTabOperator from "./DuplicateTabOperator";
import ToggleReaderOperator from "./ToggleReaderOperator";
import LastSelectedTab from "../../tabs/LastSelectedTab";

@injectable()
export default class TabOperatorFactoryChain implements OperatorFactoryChain {
  constructor(
    @inject("LastSelectedTab")
    private readonly lastSelectedTab: LastSelectedTab
  ) {}
  create(op: operations.Operation): Operator | null {
    switch (op.type) {
      case operations.TAB_CLOSE:
        return new CloseTabOperator(false, op.select === "left");
      case operations.TAB_CLOSE_RIGHT:
        return new CloseTabRightOperator();
      case operations.TAB_CLOSE_FORCE:
        return new CloseTabOperator(true, false);
      case operations.TAB_REOPEN:
        return new ReopenTabOperator();
      case operations.TAB_PREV:
        return new SelectTabPrevOperator();
      case operations.TAB_NEXT:
        return new SelectTabNextOperator();
      case operations.TAB_FIRST:
        return new SelectFirstTabOperator();
      case operations.TAB_LAST:
        return new SelectLastTabOperator();
      case operations.TAB_PREV_SEL:
        return new SelectPreviousSelectedTabOperator(this.lastSelectedTab);
      case operations.TAB_RELOAD:
        return new ReloadTabOperator(op.cache);
      case operations.TAB_PIN:
        return new PinTabOperator();
      case operations.TAB_UNPIN:
        return new UnpinTabOperator();
      case operations.TAB_TOGGLE_PINNED:
        return new TogglePinnedTabOperator();
      case operations.TAB_DUPLICATE:
        return new DuplicateTabOperator();
      case operations.TAB_TOGGLE_READER:
        return new ToggleReaderOperator();
    }
    return null;
  }
}
