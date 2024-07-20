import { injectable, inject } from "inversify";
import type { HintPresenter } from "../presenters/HintPresenter";
import type { HTMLElementType } from "../../shared/HTMLElementType";

@injectable()
export class HintUseCase {
  constructor(
    @inject("HintPresenter")
    private readonly presenter: HintPresenter,
  ) {}

  async lookupTargets(
    cssSelector: string,
    viewSize: { width: number; height: number },
    framePosition: { x: number; y: number },
  ): Promise<string[]> {
    const ids = this.presenter.lookupTargets(
      cssSelector,
      viewSize,
      framePosition,
    );
    return ids;
  }

  async assignTags(elementTags: Record<string, string>): Promise<void> {
    this.presenter.assignTags(elementTags);
  }

  async showHints(ids: string[]): Promise<void> {
    return this.presenter.showHints(ids);
  }

  async clearHints(): Promise<void> {
    return this.presenter.clearHints();
  }

  async getElement(elementId: string): Promise<HTMLElementType | undefined> {
    return this.presenter.getElement(elementId);
  }

  async focusElement(elementId: string): Promise<void> {
    return this.presenter.focusElement(elementId);
  }

  async clickElement(elementId: string): Promise<void> {
    return this.presenter.clickElement(elementId);
  }
}
