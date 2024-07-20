import { injectable, inject } from "inversify";
import { VersionUseCase } from "../usecases/VersionUseCase";

@injectable()
export class VersionController {
  constructor(
    @inject(VersionUseCase)
    private readonly versionUseCase: VersionUseCase,
  ) {}

  notify(): Promise<void> {
    return this.versionUseCase.notify();
  }
}
