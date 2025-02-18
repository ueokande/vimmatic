import { injectable, inject } from "inversify";
import { VisualUseCase } from "../usecases/VisualUseCase";

@injectable()
export class VisualController {
  constructor(
    @inject(VisualUseCase)
    private readonly visualUseCase: VisualUseCase,
  ) {}

  moveLeft({amount}: {amount: number}) {
    this.visualUseCase.moveLeft(amount);
  }

  moveRight({amount}: {amount: number}) {
    this.visualUseCase.moveRight(amount);
  }

  moveEndWord({amount}: {amount: number}) {
    this.visualUseCase.moveEndWord(amount);
  }

  moveNextWord({amount}: {amount: number}) {
    this.visualUseCase.moveNextWord(amount);
  }

  movePrevWord({amount}: {amount: number}) {
    this.visualUseCase.movePrevWord(amount);
  }

}
