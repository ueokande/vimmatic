import { injectable, inject } from "inversify";
import { VisualUseCase } from "../usecases/VisualUseCase";

@injectable()
export class VisualController {
  constructor(
    @inject(VisualUseCase)
    private readonly visualUseCase: VisualUseCase,
  ) {}

  moveLeft() {
    this.visualUseCase.moveLeft();
  }

  moveRight() {
    this.visualUseCase.moveRight();
  }

  moveEndWord() {
    this.visualUseCase.moveEndWord();
  }

  moveNextWord() {
    this.visualUseCase.moveNextWord();
  }

  movePrevWord() {
    this.visualUseCase.movePrevWord();
  }
}
