import { inject, injectable } from "inversify";
import { HintModeUseCase } from "../../usecases/HintModeUseCase";
import { ModeUseCase } from "../../usecases/ModeUseCase";
import { QuickHintOperator } from "./QuickHintOperator";

// "follow.start" is an alias of "quick.hint"
@injectable()
export class StartFollowOperator extends QuickHintOperator {
  // NOTE: esbuild only emits parameter-injection metadata for decorators
  // declared on a class's own constructor, not inherited ones. Without
  // redeclaring the constructor here, DI resolves this class with no
  // dependencies, leaving hintModeUseCase/modeUseCase undefined at runtime.
  constructor(
    @inject(HintModeUseCase)
    hintModeUseCase: HintModeUseCase,
    @inject(ModeUseCase)
    modeUseCase: ModeUseCase,
  ) {
    super(hintModeUseCase, modeUseCase);
  }

  name(): string {
    return "follow.start";
  }
}
