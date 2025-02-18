import { injectable, inject } from "inversify";
import { VisualPresenter } from "../presenters/VisualPresenter";



@injectable()
export class VisualUseCase {
  constructor(
    @inject(VisualPresenter)
    private readonly visualPresenter: VisualPresenter,
  ) {}

  moveLeft(amount: number) {
    while (amount > 0) { 
        amount--;
        this.visualPresenter.moveLeft();
    }
    this.visualPresenter.select();
  }

  moveRight(amount: number) {
    while (amount > 0) {
        amount--;
        this.visualPresenter.moveRight();
    }
    this.visualPresenter.select();
  }

  moveEndWord(amount: number) {
    while (amount > 0) {
        amount--;
        this.visualPresenter.moveEndWord();
    }
    this.visualPresenter.select();
  }

  moveNextWord(amount: number) {
    while (amount > 0) {
        amount--;
        this.visualPresenter.moveNextWord();
    }
    this.visualPresenter.select();
  }

  movePrevWord(amount: number) {
      while (amount > 0) {
          amount--;
          this.visualPresenter.movePrevWord();
      }
      this.visualPresenter.select(); 
  }

}
