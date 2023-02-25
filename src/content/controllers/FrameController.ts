import { injectable, inject } from "inversify";
import FrameUseCase from "../usecases/FrameUseCase";

@injectable()
export default class FrameController {
  constructor(
    @inject(FrameUseCase)
    private readonly frameUseCase: FrameUseCase
  ) {}

  notifyToParent({ frameId }: { frameId: number }): Promise<void> {
    return this.frameUseCase.notifyFrameIdToTop(frameId);
  }
}
