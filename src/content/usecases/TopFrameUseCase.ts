import { injectable, inject } from "inversify";
import FrameIdRepository from "../repositories/FrameIdRepository";

@injectable()
export default class TopFrameUseCase {
  constructor(
    @inject("FrameIdRepository")
    private readonly frameIdRepository: FrameIdRepository
  ) {}

  async saveChildFrame(frameId: number, target: Window): Promise<void> {
    if (frameId === 0) {
      // top window
      const element = window.document.documentElement;
      this.frameIdRepository.saveFrameId(frameId, target, element);
      return;
    }

    const iframes = window.document.querySelectorAll("iframe");
    const element = Array.from(iframes).find((e) => e.contentWindow === target);
    if (typeof element === "undefined") {
      return;
    }
    this.frameIdRepository.saveFrameId(frameId, target, element);
  }

  getWindowViewsize(): {
    width: number;
    height: number;
  } {
    return {
      width: window.top.innerWidth,
      height: window.top.innerHeight,
    };
  }

  getFramePosition(frameId: number): { x: number; y: number } | undefined {
    if (frameId === 0) {
      return { x: 0, y: 0 };
    }
    const element = this.frameIdRepository.getFrameElement(frameId);
    if (!element) {
      return;
    }
    const { left, top } = element.getBoundingClientRect();
    return { x: left, y: top };
  }
}
