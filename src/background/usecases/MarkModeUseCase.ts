import { injectable, inject } from "inversify";
import type KeyCaptureClient from "../clients/KeyCaptureClient";
import type MarkModeRepository from "../repositories/MarkModeRepository";
import type RequestContext from "../infrastructures/RequestContext";

@injectable()
export default class MarkModeUseCase {
  constructor(
    @inject("MarkModeRepository")
    private readonly markModeRepository: MarkModeRepository,
    @inject("KeyCaptureClient")
    private keyCaptureClient: KeyCaptureClient
  ) {}

  async enableMarkSetMode(ctx: RequestContext) {
    const { tabId } = ctx.sender;
    await this.keyCaptureClient.enableKeyCapture(tabId);
    this.markModeRepository.enableSetMode();
  }

  async enableMarkJumpMode(ctx: RequestContext) {
    const { tabId } = ctx.sender;
    await this.keyCaptureClient.enableKeyCapture(tabId);
    this.markModeRepository.enableJumpMode();
  }

  async clearMarkMode(ctx: RequestContext) {
    const { tabId } = ctx.sender;
    await this.keyCaptureClient.disableKeyCapture(tabId);
    this.markModeRepository.clearMode();
  }

  isSetMode(): Promise<boolean> {
    return Promise.resolve(this.markModeRepository.isSetMode());
  }

  isJumpMode(): Promise<boolean> {
    return Promise.resolve(this.markModeRepository.isJumpMode());
  }
}
