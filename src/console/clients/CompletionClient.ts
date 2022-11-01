import * as messages from "../../shared/messages";
import { ConsoleGetCompletionsResponse } from "../../shared/messages";
import { Completions } from "../../shared/Completions";

export default class CompletionClient {
  async getCompletions(query: string): Promise<Completions> {
    const resp = (await browser.runtime.sendMessage({
      type: messages.CONSOLE_GET_COMPLETIONS,
      query,
    })) as ConsoleGetCompletionsResponse;
    return resp;
  }
}
