import { injectable, inject } from "inversify";
import type KeyCaptureClient from "../clients/KeyCaptureClient";
import type MarkModeRepository from "../repositories/MarkModeRepository";

@injectable()
export default class MarkModeUseCase {
  constructor(
    @inject("MarkModeRepository")
    private readonly markModeRepository: MarkModeRepository,
    @inject("KeyCaptureClient")
    private keyCaptureClient: KeyCaptureClient
  ) {}

  async enableMarkSetMode(tabId: number) {
    await this.keyCaptureClient.enableKeyCapture(tabId);
    this.markModeRepository.enableSetMode();
  }

  async enableMarkJumpMode(tabId: number) {
    await this.keyCaptureClient.enableKeyCapture(tabId);
    this.markModeRepository.enableJumpMode();
  }

  async clearMarkMode(tabId: number) {
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
