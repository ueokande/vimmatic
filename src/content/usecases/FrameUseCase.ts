import { inject, injectable } from "inversify";
import { TopFrameClient } from "../client/TopFrameClient";

@injectable()
export class FrameUseCase {
  constructor(
    @inject(TopFrameClient)
    private readonly topFrameClient: TopFrameClient,
  ) {}

  notifyFrameIdToTop(frameId: number): Promise<void> {
    return this.topFrameClient.notifyFrameId(frameId);
  }
}
