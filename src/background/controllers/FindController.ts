import { injectable, inject } from "inversify";
import { Completions } from "../../shared/Completions";
import FindUseCase from "../usecases/FindUseCase";
import RequestContext from "../messaging/RequestContext";

@injectable()
export default class FindController {
  constructor(
    @inject(FindUseCase)
    private findUseCase: FindUseCase
  ) {}

  exec(
    { sender }: RequestContext,
    { keyword }: { keyword?: string }
  ): Promise<void> {
    if (typeof sender.tab?.id === "undefined") {
      return Promise.resolve();
    }
    return this.findUseCase.startFind(sender.tab.id, keyword);
  }

  async getCompletions(
    _ctx: RequestContext,
    { query }: { query: string }
  ): Promise<Completions> {
    const histories = await this.findUseCase.getHistories(query);
    const items = histories.map((hist) => ({
      primary: hist,
      value: hist,
    }));
    return [
      {
        name: "Find History",
        items,
      },
    ];
  }
}
