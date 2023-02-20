import { injectable, inject } from "inversify";
import Key from "../../shared/Key";
import type KeyCaptureModeRepository from "../repositories/KeyCaptureModeRepository";
import type BackgroundKeyClient from "../client/BackgroundKeyClient";

@injectable()
export default class BackgroundKeyUseCase {
  constructor(
    @inject("KeyCaptureModeRepository")
    private readonly keyCaptureModeRepository: KeyCaptureModeRepository,
    @inject("BackgroundKeyClient")
    private readonly backgroundKeyClient: BackgroundKeyClient
  ) {}

  capture(key: Key): boolean {
    if (!this.keyCaptureModeRepository.keyCaptureEnabled()) {
      return false;
    }
    this.backgroundKeyClient.sendKey(key);
    return true;
  }

  enableKeyCapture() {
    this.keyCaptureModeRepository.enableKeyCapture();
  }

  disableKeyCapture() {
    this.keyCaptureModeRepository.disableKeyCapture();
  }
}
