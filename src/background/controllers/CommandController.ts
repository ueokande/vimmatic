import { injectable, inject } from "inversify";
import type { Completions } from "../../shared/completions";
import { CommandUseCase } from "../usecases/CommandUseCase";
import type { RequestContext } from "../messaging/types";

@injectable()
export class CommandController {
  constructor(
    @inject(CommandUseCase)
    private readonly commandUseCase: CommandUseCase,
  ) {}

  async exec(ctx: RequestContext, { text }: { text: string }): Promise<void> {
    return this.commandUseCase.exec(ctx, text);
  }

  async getCompletions(
    _ctx: RequestContext,
    { query }: { query: string },
  ): Promise<Completions> {
    return this.commandUseCase.getCompletions(query);
  }
}
