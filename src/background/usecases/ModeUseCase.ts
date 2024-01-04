import { inject, injectable } from "inversify";
import Mode from "../../shared/Mode";
import type ModeClient from "../clients/ModeClient";
import type ModeRepository from "../repositories/ModeRepository";

@injectable()
export default class ModeUseCase {
  constructor(
    @inject("ModeRepository")
    private readonly modeRepository: ModeRepository,
    @inject("ModeClient")
    private readonly modeClient: ModeClient,
  ) {}

  getMode(): Promise<Mode> {
    return this.modeRepository.getMode();
  }

  async setMode(tabId: number, mode: Mode): Promise<void> {
    await this.modeClient.setMode(tabId, mode);
    await this.modeRepository.setMode(mode);
  }

  async resetMode(tabId: number): Promise<void> {
    return this.setMode(tabId, Mode.Normal);
  }
}
