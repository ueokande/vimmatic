import { injectable, inject } from "inversify";
import Mode from "../../shared/Mode";
import ModeRepository from "../repositories/ModeRepository";

@injectable()
export default class ModeController {
  constructor(
    @inject("ModeRepository")
    private readonly modeRepository: ModeRepository,
  ) {}

  setMode({ mode }: { mode: Mode }): void {
    this.modeRepository.setMode(mode);
  }
}
