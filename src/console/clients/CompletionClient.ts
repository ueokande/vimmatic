import { Completions } from "../../shared/Completions";
import type BackgroundMessageSender from "./BackgroundMessageSender";

export default class CompletionClient {
  constructor(private readonly sender: BackgroundMessageSender) {}

  async getCompletions(query: string): Promise<Completions> {
    return this.sender.send("console.get.completions", { query });
  }
}
