import { injectable, inject } from "inversify";
import { Completions } from "../../shared/Completions";
import CommandUseCase from "../usecases/CommandUseCase";
import RequestContext from "./RequestContext";

@injectable()
export default class CommandController {
  constructor(
    @inject(CommandUseCase)
    private readonly commandUseCase: CommandUseCase
  ) {}

  async exec(_ctx: RequestContext, { text }: { text: string }): Promise<void> {
    return this.commandUseCase.exec(text);
  }

  async getCompletions(
    _ctx: RequestContext,
    { query }: { query: string }
  ): Promise<Completions> {
    return this.commandUseCase.getCompletions(query);
  }
}
