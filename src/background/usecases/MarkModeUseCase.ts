import { injectable, inject } from "inversify";
import type KeyCaptureClient from "../clients/KeyCaptureClient";
import type MarkModeRepository from "../repositories/MarkModeRepository";
import RequestContext from "../infrastructures/RequestContext";

@injectable()
export default class MarkModeUseCase {
  constructor(
    @inject("MarkModeRepository")
    private readonly markModeRepository: MarkModeRepository,
    @inject("KeyCaptureClient")
    private keyCaptureClient: KeyCaptureClient
  ) {}

  async enableMarkSetMode(ctx: RequestContext) {
    const tabId = ctx.sender?.tab?.id;
    if (!tabId) {
      return;
    }
    await this.keyCaptureClient.enableKeyCapture(tabId);
    await this.markModeRepository.enableSetMode();
  }

  async enableMarkJumpMode(ctx: RequestContext) {
    const tabId = ctx.sender?.tab?.id;
    if (!tabId) {
      return;
    }
    await this.keyCaptureClient.enableKeyCapture(tabId);
    await this.markModeRepository.enableJumpMode();
  }

  async clearMarkMode(ctx: RequestContext) {
    const tabId = ctx.sender?.tab?.id;
    if (!tabId) {
      return;
    }
    await this.keyCaptureClient.disableKeyCapture(tabId);
    await this.markModeRepository.clearMode();
  }

  async isSetMode(): Promise<boolean> {
    return this.markModeRepository.isSetMode();
  }

  async isJumpMode(): Promise<boolean> {
    return this.markModeRepository.isJumpMode();
  }
}
