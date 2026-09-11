import { inject, injectable } from "inversify";
import { TopFrameUseCase } from "../usecases/TopFrameUseCase";
import type { WindowRequestContext } from "./types";

@injectable()
export class TopFrameController {
  constructor(
    @inject(TopFrameUseCase)
    private readonly topFrameUseCase: TopFrameUseCase,
  ) {}

  saveChildFrame(
    ctx: WindowRequestContext,
    { frameId }: { frameId: number },
  ): Promise<void> {
    return this.topFrameUseCase.saveChildFrame(frameId, ctx.sender);
  }

  async getWindowViewport(): Promise<{
    width: number;
    height: number;
  }> {
    return this.topFrameUseCase.getWindowViewsize();
  }

  async getFramePosition({
    frameId,
  }: {
    frameId: number;
  }): Promise<{ x: number; y: number } | undefined> {
    return this.topFrameUseCase.getFramePosition(frameId);
  }
}
