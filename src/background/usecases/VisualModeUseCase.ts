import { injectable, inject } from "inversify";
import { ReadyFrameRepository } from "../repositories/ReadyFrameRepository";

@injectable()
export class VisualModeUseCase {
  constructor(
    @inject(ReadyFrameRepository)
    private readonly frameRepository: ReadyFrameRepository,
  ) {}

  pressKey(key: string): boolean {
    switch (key) {
      case "Esc":
        return false;
    }
    return true;
  }

  async start(tabId: number): Promise<void> {
    const frameIds = await this.frameRepository.getFrameIds(tabId);
    if (typeof frameIds === "undefined") {
      return;
    }
  }
}
