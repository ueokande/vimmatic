import { inject, injectable } from "inversify";
import { Mode } from "../../shared/mode";
import { FocusedFrameRepository } from "../repositories/FocusedFrameRepository";
import { ModeUseCase } from "./ModeUseCase";

@injectable()
export class FocusStateUseCase {
  constructor(
    @inject(FocusedFrameRepository)
    private readonly focusedFrameRepository: FocusedFrameRepository,
    @inject(ModeUseCase)
    private readonly modeUseCase: ModeUseCase,
  ) {}

  async notifyFocusChanged(
    tabId: number,
    frameId: number,
    focused: boolean,
  ): Promise<void> {
    const anyFocused = await this.focusedFrameRepository.setFocused(
      tabId,
      frameId,
      focused,
    );
    await this.reconcile(tabId, anyFocused);
  }

  async clearFrame(tabId: number, frameId: number): Promise<void> {
    const anyFocused = await this.focusedFrameRepository.removeFrame(
      tabId,
      frameId,
    );
    await this.reconcile(tabId, anyFocused);
  }

  // Drops all focus tracking for a tab (e.g. on navigation).  The mode itself
  // is reset by the caller (navigation already resets to Normal); this just
  // prevents a stale focused-frame entry from re-deriving Insert afterwards.
  async clearTab(tabId: number): Promise<void> {
    await this.focusedFrameRepository.clearTab(tabId);
  }

  private async reconcile(tabId: number, anyFocused: boolean): Promise<void> {
    const current = await this.modeUseCase.getMode(tabId);

    // Insert is derived purely from focus and only toggles against Normal.
    // The transient hint/mark modes (Follow, MarkSet, MarkJump) are owned by
    // their own flows and must not be overridden here, otherwise focusing an
    // input while a hint is showing would cancel the hint.
    if (anyFocused) {
      if (current === Mode.Normal) {
        await this.modeUseCase.setMode(tabId, Mode.Insert);
      }
    } else if (current === Mode.Insert) {
      await this.modeUseCase.setMode(tabId, Mode.Normal);
    }
  }
}
