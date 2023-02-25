import KeyCaptureClient from "../../../src/background/clients/KeyCaptureClient";

export default class MockKeyCaptureClient implements KeyCaptureClient {
  enableKeyCapture(_tabId: number): Promise<void> {
    throw new Error("not implemented");
  }

  disableKeyCapture(_tabId: number): Promise<void> {
    throw new Error("not implemented");
  }
}
