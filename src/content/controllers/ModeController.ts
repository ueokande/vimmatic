import { injectable, inject } from "inversify";
import type { Mode } from "../../shared/mode";
import type { ModeRepository } from "../repositories/ModeRepository";

@injectable()
export class ModeController {
  constructor(
    @inject("ModeRepository")
    private readonly modeRepository: ModeRepository,
  ) {}

  setMode({ mode }: { mode: Mode }): void {
    this.modeRepository.setMode(mode);
  }
}
