import { injectable, inject } from "inversify";
import { ScrollPresenter } from "../presenters/ScrollPresenter";

@injectable()
export class ScrollController {
  constructor(
    @inject(ScrollPresenter)
    private readonly scrollPresenter: ScrollPresenter,
  ) {}

  scrollVertically({ amount, smooth }: { amount: number; smooth: boolean }) {
    this.scrollPresenter.scrollVertically(amount, smooth);
  }

  scrollHorizonally({ amount, smooth }: { amount: number; smooth: boolean }) {
    this.scrollPresenter.scrollHorizonally(amount, smooth);
  }

  scrollPages({ amount, smooth }: { amount: number; smooth: boolean }) {
    this.scrollPresenter.scrollPages(amount, smooth);
  }

  scrollToTop({ smooth }: { smooth: boolean }) {
    this.scrollPresenter.scrollToTop(smooth);
  }

  scrollToBottom({ smooth }: { smooth: boolean }) {
    this.scrollPresenter.scrollToBottom(smooth);
  }

  scrollToHome({ smooth }: { smooth: boolean }) {
    this.scrollPresenter.scrollToHome(smooth);
  }

  scrollToEnd({ smooth }: { smooth: boolean }) {
    this.scrollPresenter.scrollToEnd(smooth);
  }

  scrollTo({ x, y, smooth }: { x: number; y: number; smooth: boolean }) {
    this.scrollPresenter.scrollTo(x, y, smooth);
  }

  getScroll(): Promise<{ x: number; y: number }> {
    return Promise.resolve(this.scrollPresenter.getScroll());
  }
}
