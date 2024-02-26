import type { BackgroundMessageSender } from "./BackgroundMessageSender";
import type { Completions } from "../../shared/completions";

export default class FindClient {
  constructor(private readonly sender: BackgroundMessageSender) {}

  async execFind(text?: string): Promise<void> {
    this.sender.send("console.find.enter", { keyword: text });
  }

  async getCompletions(query: string): Promise<Completions> {
    return this.sender.send("console.find.completions", { query });
  }
}
