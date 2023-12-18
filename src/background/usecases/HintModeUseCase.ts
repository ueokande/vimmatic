import { injectable, inject } from "inversify";
import ReadyFrameRepository from "../repositories/ReadyFrameRepository";
import PropertySettings from "../settings/PropertySettings";
import TopFrameClient from "../clients/TopFrameClient";
import HintTagProducer from "./HintTagProducer";
import HintClient from "../clients/HintClient";
import KeyCaptureClient from "../clients/KeyCaptureClient";
import HintRepository from "../repositories/HintRepository";

@injectable()
export default class HintModeUseCaes {
  constructor(
    @inject("TopFrameClient")
    private readonly topFrameClient: TopFrameClient,
    @inject("HintClient")
    private readonly hintClient: HintClient,
    @inject("ReadyFrameRepository")
    private readonly frameRepository: ReadyFrameRepository,
    @inject("PropertySettings")
    private readonly propertySettings: PropertySettings,
    @inject("KeyCaptureClient")
    private readonly keyCaptureClient: KeyCaptureClient,
    @inject("HintRepository")
    private readonly hintRepository: HintRepository,
  ) {}

  async start(
    tabId: number,
    newTab: boolean,
    background: boolean,
  ): Promise<void> {
    const frameIds = await this.frameRepository.getFrameIds(tabId);
    if (typeof frameIds === "undefined") {
      return;
    }
    const hintchars = (await this.propertySettings.getProperty(
      "hintchars",
    )) as string;

    const viewport = await this.topFrameClient.getWindowViewport(tabId);
    const hintKeys = new HintTagProducer(hintchars);
    const hints = [];
    for (const frameId of frameIds) {
      const framePos = await this.topFrameClient.getFramePosition(
        tabId,
        frameId,
      );
      if (!framePos) {
        continue;
      }
      const count = await this.hintClient.countHints(
        tabId,
        frameId,
        viewport,
        framePos,
      );
      const tags = hintKeys.produceN(count);
      hints.push(...tags);
      await this.hintClient.createHints(
        tabId,
        frameId,
        tags,
        viewport,
        framePos,
      );
    }

    await this.hintRepository.startHintMode({ newTab, background }, hints);
    await this.keyCaptureClient.enableKeyCapture(tabId);
  }

  async stop(tabId: number): Promise<void> {
    await this.hintClient.clearHints(tabId);
    await this.hintRepository.stopHintMode();
    await this.keyCaptureClient.disableKeyCapture(tabId);
  }

  isHintMode(): Promise<boolean> {
    return Promise.resolve(this.hintRepository.isEnabled());
  }
}
