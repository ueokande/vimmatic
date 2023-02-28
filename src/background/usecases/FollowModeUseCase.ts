import { injectable, inject } from "inversify";
import ReadyFrameRepository from "../repositories/ReadyFrameRepository";
import RequestContext from "../infrastructures/RequestContext";
import PropertySettings from "../settings/PropertySettings";
import TopFrameClient from "../clients/TopFrameClient";
import FollowTagProducer from "./FollowTagProducer";
import FollowClient from "../clients/FollowClient";
import KeyCaptureClient from "../clients/KeyCaptureClient";
import FollowRepository from "../repositories/FollowRepository";

@injectable()
export default class FollowModeUseCaes {
  constructor(
    @inject("TopFrameClient")
    private readonly topFrameClient: TopFrameClient,
    @inject("FollowClient")
    private readonly followClient: FollowClient,
    @inject("ReadyFrameRepository")
    private readonly frameRepository: ReadyFrameRepository,
    @inject("PropertySettings")
    private readonly propertySettings: PropertySettings,
    @inject("KeyCaptureClient")
    private readonly keyCaptureClient: KeyCaptureClient,
    @inject("FollowRepository")
    private readonly followRepository: FollowRepository
  ) {}

  async start(
    ctx: RequestContext,
    newTab: boolean,
    background: boolean
  ): Promise<void> {
    const { tabId } = ctx.sender;
    const frameIds = this.frameRepository.getFrameIds(tabId);
    if (typeof frameIds === "undefined") {
      return;
    }
    const hintchars = (await this.propertySettings.getProperty(
      "hintchars"
    )) as string;

    const viewport = await this.topFrameClient.getWindowViewport(tabId);
    const hintKeys = new FollowTagProducer(hintchars);
    const hints = [];
    for (const frameId of frameIds) {
      const framePos = await this.topFrameClient.getFramePosition(
        tabId,
        frameId
      );
      if (!framePos) {
        continue;
      }
      const count = await this.followClient.countHints(
        tabId,
        frameId,
        viewport,
        framePos
      );
      const tags = hintKeys.produceN(count);
      hints.push(...tags);
      await this.followClient.createHints(
        tabId,
        frameId,
        tags,
        viewport,
        framePos
      );
    }

    this.followRepository.startFollowMode({ newTab, background }, hints);
    await this.keyCaptureClient.enableKeyCapture(tabId);
  }

  async stop(ctx: RequestContext): Promise<void> {
    const { tabId } = ctx.sender;
    await this.followClient.clearHints(tabId);
    this.followRepository.stopFollowMode();
    await this.keyCaptureClient.disableKeyCapture(tabId);
  }

  isFollowMode(): Promise<boolean> {
    return Promise.resolve(this.followRepository.isEnabled());
  }
}
