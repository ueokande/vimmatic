import { injectable, inject } from "inversify";
import KeymapUseCase from "../usecases/KeymapUseCase";
import OperationUseCase from "../usecases/OperationUseCase";
import Key from "../../shared/Key";

@injectable()
export default class KeymapController {
  constructor(
    @inject(KeymapUseCase)
    private readonly keymapUseCase: KeymapUseCase,
    @inject(OperationUseCase)
    private readonly operationUseCase: OperationUseCase,
  ) {}

  // eslint-disable-next-line complexity, max-lines-per-function
  press(key: Key): boolean {
    const op = this.keymapUseCase.nextOps(key);
    if (op === null) {
      return false;
    }

    // Do not await an asynchronous methods to return a boolean immidiately.
    // The caller requires the synchronous response from the callback to
    // identify to continue of abandon the event propagation.
    this.operationUseCase
      .exec(op.name, op.props, op.repeat)
      // eslint-disable-next-line no-console
      .catch(console.error);
    return true;
  }

  onBlurWindow() {
    this.keymapUseCase.cancel();
  }
}
