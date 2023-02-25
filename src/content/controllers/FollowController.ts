import { injectable, inject } from "inversify";
import FollowUseCase from "../usecases/FollowUseCase";

@injectable()
export default class FollowController {
  constructor(
    @inject(FollowUseCase)
    private readonly followUseCase: FollowUseCase
  ) {}

  async countHints({
    viewSize,
    framePosition,
  }: {
    viewSize: { width: number; height: number };
    framePosition: { x: number; y: number };
  }): Promise<number> {
    return this.followUseCase.countHints(viewSize, framePosition);
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
    return this.followUseCase.createHints(viewSize, framePosition, hints);
  }

  async filterHints({ prefix }: { prefix: string }): Promise<void> {
    return this.followUseCase.filterHints(prefix);
  }

  async remove(): Promise<void> {
    return this.followUseCase.remove();
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
    return this.followUseCase.activateIfExists(hint, newTab, background);
  }
}
