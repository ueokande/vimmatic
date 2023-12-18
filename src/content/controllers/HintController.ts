import { injectable, inject } from "inversify";
import HintUseCase from "../usecases/HintUseCase";

@injectable()
export default class HintController {
  constructor(
    @inject(HintUseCase)
    private readonly hintUseCase: HintUseCase,
  ) {}

  async countHints({
    viewSize,
    framePosition,
  }: {
    viewSize: { width: number; height: number };
    framePosition: { x: number; y: number };
  }): Promise<number> {
    return this.hintUseCase.countHints(viewSize, framePosition);
  }

  async createHints({
    viewSize,
    framePosition,
    hints,
  }: {
    viewSize: { width: number; height: number };
    framePosition: { x: number; y: number };
    hints: string[];
  }): Promise<void> {
    return this.hintUseCase.createHints(viewSize, framePosition, hints);
  }

  async filterHints({ prefix }: { prefix: string }): Promise<void> {
    return this.hintUseCase.filterHints(prefix);
  }

  async remove(): Promise<void> {
    return this.hintUseCase.remove();
  }

  async activateIfExists({
    hint,
    newTab,
    background,
  }: {
    hint: string;
    newTab: boolean;
    background: boolean;
  }): Promise<void> {
    return this.hintUseCase.activateIfExists(hint, newTab, background);
  }
}
