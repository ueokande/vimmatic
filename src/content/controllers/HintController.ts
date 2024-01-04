import { injectable, inject } from "inversify";
import HintUseCase from "../usecases/HintUseCase";
import type HTMLElementType from "../../shared/HTMLElementType";

@injectable()
export default class HintController {
  constructor(
    @inject(HintUseCase)
    private readonly hintUseCase: HintUseCase,
  ) {}

  async lookupTargets({
    cssSelector,
    viewSize,
    framePosition,
  }: {
    cssSelector: string;
    viewSize: { width: number; height: number };
    framePosition: { x: number; y: number };
  }): Promise<{ elements: string[] }> {
    const ids = await this.hintUseCase.lookupTargets(
      cssSelector,
      viewSize,
      framePosition,
    );
    return { elements: ids };
  }

  async assignTags({
    elementTags,
  }: {
    elementTags: Record<string, string>;
  }): Promise<void> {
    await this.hintUseCase.assignTags(elementTags);
  }

  async showHints({ elements }: { elements: string[] }): Promise<void> {
    await this.hintUseCase.showHints(elements);
  }

  async clearHints(): Promise<void> {
    return this.hintUseCase.clearHints();
  }

  async getElement({
    element,
  }: {
    element: string;
  }): Promise<HTMLElementType | undefined> {
    return this.hintUseCase.getElement(element);
  }

  async focusElement({ element }: { element: string }): Promise<void> {
    this.hintUseCase.focusElement(element);
  }

  async clickElement({ element }: { element: string }): Promise<void> {
    this.hintUseCase.clickElement(element);
  }
}
