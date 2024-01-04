import { injectable } from "inversify";
import QuickHintOperator from "./QuickHintOperator";

// "follow.start" is an alias of "quick.hint"
@injectable()
export default class StartFollowOperator extends QuickHintOperator {
  name(): string {
    return "follow.start";
  }
}
