import { provide } from "inversify-binding-decorators";
import { newSender } from "./ConsoleMessageSender";

export interface ConsoleClient {
  showCommand(tabId: number, command: string): Promise<void>;

  showFind(tabId: number): Promise<void>;

  showInfo(tabId: number, message: string): Promise<void>;

  showError(tabId: number, message: string): Promise<void>;

  hide(tabId: number): Promise<void>;
}

export const ConsoleClient = Symbol("ConsoleClient");

@provide(ConsoleClient)
export class ConsoleClientImpl implements ConsoleClient {
  async showCommand(tabId: number, command: string): Promise<void> {
    const sender = newSender(tabId);
    await sender.send("console.show.command", { command });
  }

  async showFind(tabId: number): Promise<void> {
    const sender = newSender(tabId);
    await sender.send("console.show.find");
  }

  async showInfo(tabId: number, message: string): Promise<void> {
    const sender = newSender(tabId);
    sender.send("console.show.info", { text: message });
  }

  async showError(tabId: number, message: string): Promise<void> {
    const sender = newSender(tabId);
    sender.send("console.show.error", { text: message });
  }

  async hide(tabId: number): Promise<void> {
    const sender = newSender(tabId);
    sender.send("console.hide");
  }
}
