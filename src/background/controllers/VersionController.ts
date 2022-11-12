import { injectable, inject } from "inversify";
import VersionUseCase from "../usecases/VersionUseCase";
import RequestContext from "./RequestContext";

@injectable()
export default class VersionController {
  constructor(
    @inject(VersionUseCase)
    private readonly versionUseCase: VersionUseCase
  ) {}

  notify(_ctx: RequestContext): Promise<void> {
    return this.versionUseCase.notify();
  }
}
