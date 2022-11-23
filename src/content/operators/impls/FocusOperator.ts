import { injectable, inject } from "inversify";
import Operator from "../Operator";
import FocusPresenter from "../../presenters/FocusPresenter";

@injectable()
export default class FocusOperator implements Operator {
  constructor(
    @inject("FocusPresenter")
    private readonly presenter: FocusPresenter
  ) {}

  name() {
    return "focus.input";
  }

  schema() {}

  async run(): Promise<void> {
    this.presenter.focusFirstElement();
  }
}
