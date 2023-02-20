import { injectable } from "inversify";

export default interface KeyCaptureModeRepository {
  enableKeyCapture(): void;

  disableKeyCapture(): void;

  keyCaptureEnabled(): boolean;
}

let enabled = false;

@injectable()
export class KeyCaptureModeRepositoryImpl implements KeyCaptureModeRepository {
  enableKeyCapture(): void {
    enabled = true;
  }

  disableKeyCapture(): void {
    enabled = false;
  }

  keyCaptureEnabled(): boolean {
    return enabled;
  }
}
