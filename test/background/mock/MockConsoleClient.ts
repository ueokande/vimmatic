import ConsoleClient from "../../../src/background/clients/ConsoleClient";

export default class MockConsoleClient implements ConsoleClient {
  hide(_tabId: number): Promise<void> {
    throw new Error("not implemented");
  }

  showCommand(_tabId: number, _command: string): Promise<void> {
    throw new Error("not implemented");
  }

  showError(_tabId: number, _message: string): Promise<void> {
    throw new Error("not implemented");
  }

  showFind(_tabId: number): Promise<void> {
    throw new Error("not implemented");
  }

  showInfo(_tabId: number, _message: string): Promise<void> {
    throw new Error("not implemented");
  }
}
