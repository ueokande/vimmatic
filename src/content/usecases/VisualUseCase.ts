import { injectable, inject } from "inversify";
import { VisualPresenter } from "../presenters/VisualPresenter";

@injectable()
export class VisualUseCase {
  constructor(
    @inject(VisualPresenter)
    private readonly visualPresenter: VisualPresenter,
  ) {}

  moveLeft() {
    if (!this.visualPresenter.isValidCarret()) {
      this.visualPresenter.updateCarrets();
    }

    this.visualPresenter.moveLeft();
    this.visualPresenter.select();
  }

  moveRight() {
    if (!this.visualPresenter.isValidCarret()) {
      this.visualPresenter.updateCarrets();
    }

    this.visualPresenter.moveRight();
    this.visualPresenter.select();
  }

  moveEndWord() {
    if (!this.visualPresenter.isValidCarret()) {
      this.visualPresenter.updateCarrets();
    }

    this.visualPresenter.moveEndWord();
    this.visualPresenter.select();
  }

  moveNextWord() {
    if (!this.visualPresenter.isValidCarret()) {
      this.visualPresenter.updateCarrets();
    }

    this.visualPresenter.moveNextWord();
    this.visualPresenter.select();
  }

  movePrevWord() {
    if (!this.visualPresenter.isValidCarret()) {
      this.visualPresenter.updateCarrets();
    }

    this.visualPresenter.movePrevWord();
    this.visualPresenter.select();
  }
}
