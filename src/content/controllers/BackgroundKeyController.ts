import { injectable, inject } from "inversify";
import Key from "../../shared/Key";
import BackgroundKeyUseCase from "../usecases/BackgroundKeyUseCase";

@injectable()
export default class BackgroundKeyController {
  constructor(
    @inject(BackgroundKeyUseCase)
    private readonly backgroundKeyUseCase: BackgroundKeyUseCase
  ) {}

  press(key: Key): boolean {
    return this.backgroundKeyUseCase.capture(key);
  }

  enableCapture() {
    this.backgroundKeyUseCase.enableKeyCapture();
  }

  disableCapture() {
    this.backgroundKeyUseCase.disableKeyCapture();
  }
}
