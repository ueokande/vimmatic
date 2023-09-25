import { injectable, inject } from "inversify";
import TopFrameClient from "../client/TopFrameClient";

@injectable()
export default class FrameUseCase {
  constructor(
    @inject("TopFrameClient")
    private readonly topFrameClient: TopFrameClient,
  ) {}

  notifyFrameIdToTop(frameId: number): Promise<void> {
    return this.topFrameClient.notifyFrameId(frameId);
  }
}
