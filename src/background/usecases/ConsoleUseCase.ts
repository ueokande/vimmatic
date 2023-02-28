import { inject, injectable } from "inversify";
import ConsoleFrameClient from "../clients/ConsoleFrameClient";
import RequestContext from "../infrastructures/RequestContext";

@injectable()
export default class ConsoleUseCase {
  constructor(
    @inject("ConsoleFrameClient")
    private readonly consoleFrameClient: ConsoleFrameClient
  ) {}

  async resize(
    ctx: RequestContext,
    width: number,
    height: number
  ): Promise<void> {
    const { tabId } = ctx.sender;
    return this.consoleFrameClient.resize(tabId, width, height);
  }
}
