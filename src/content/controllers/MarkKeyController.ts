import { injectable, inject } from "inversify";
import MarkUseCase from "../usecases/MarkUseCase";
import MarkKeyUseCase from "../usecases/MarkKeyUseCase";
import Key from "../../shared/settings/Key";

@injectable()
export default class MarkKeyController {
  constructor(
    @inject(MarkUseCase)
    private readonly markUseCase: MarkUseCase,
    @inject(MarkKeyUseCase)
    private readonly markKeyUseCase: MarkKeyUseCase
  ) {}

  press(key: Key): boolean {
    if (this.markKeyUseCase.isSetMode()) {
      this.markUseCase.set(key.key);
      this.markKeyUseCase.disableSetMode();
      return true;
    }
    if (this.markKeyUseCase.isJumpMode()) {
      this.markUseCase.jump(key.key);
      this.markKeyUseCase.disableJumpMode();
      return true;
    }
    return false;
  }
}
