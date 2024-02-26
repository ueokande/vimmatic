import type { ClipboardRepository } from "../../../src/background/repositories/ClipboardRepository";

export default class MockClipboardRepository implements ClipboardRepository {
  async read(): Promise<string> {
    throw new Error("not implemented");
  }

  async write(_text: string): Promise<void> {
    throw new Error("not implemented");
  }
}
