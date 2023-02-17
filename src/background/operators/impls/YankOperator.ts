import { injectable, inject } from "inversify";
import Operator from "../Operator";
import RequestContext from "../../infrastructures/RequestContext";
import ClipboardRepository from "../../repositories/ClipboardRepository";
import ConsoleClient from "../../clients/ConsoleClient";

@injectable()
export default class YankOperator implements Operator {
  constructor(
    @inject("ClipboardRepository")
    private readonly clipboard: ClipboardRepository,
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient
  ) {}

  name() {
    return "urls.yank";
  }

  schema() {}

  async run({ sender }: RequestContext): Promise<void> {
    if (!sender?.tab?.id || !sender?.url) {
      return;
    }
    await this.clipboard.write(sender.url);
    await this.consoleClient.showInfo(sender.tab.id, "Yanked " + sender.url);
  }
}
