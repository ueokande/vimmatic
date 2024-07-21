import { inject, injectable } from "inversify";
import { ConsoleFrameClient } from "../clients/ConsoleFrameClient";

@injectable()
export class ConsoleUseCase {
  constructor(
    @inject(ConsoleFrameClient)
    private readonly consoleFrameClient: ConsoleFrameClient,
  ) {}

  async resize(tabId: number, width: number, height: number): Promise<void> {
    return this.consoleFrameClient.resize(tabId, width, height);
  }
}
