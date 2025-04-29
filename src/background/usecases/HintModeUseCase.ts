import { injectable, inject } from "inversify";
import { ReadyFrameRepository } from "../repositories/ReadyFrameRepository";
import { PropertySettings } from "../settings/PropertySettings";
import { TopFrameClient } from "../clients/TopFrameClient";
import type { HintTarget } from "../hint/types";
import { HintClient } from "../clients/HintClient";
import { HintRepository } from "../repositories/HintRepository";
import { HintActionFactory } from "../hint/HintActionFactory";
import { HintTagProducer } from "./HintTagProducer";
import { ConsoleClient } from "../clients/ConsoleClient";

@injectable()
export class HintModeUseCase {
  constructor(
    @inject(TopFrameClient)
    private readonly topFrameClient: TopFrameClient,
    @inject(HintClient)
    private readonly hintClient: HintClient,
    @inject(ReadyFrameRepository)
    private readonly frameRepository: ReadyFrameRepository,
    @inject(PropertySettings)
    private readonly propertySettings: PropertySettings,
    @inject(HintRepository)
    private readonly hintRepository: HintRepository,
    @inject(HintActionFactory)
    private readonly hintActionFactory: HintActionFactory,
    @inject(ConsoleClient)
    private readonly consoleClient: ConsoleClient,
  ) {}

  async start(
    tabId: number,
    hintModeName: string,
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

    const hintAction = this.hintActionFactory.createHintAction(hintModeName);
    const description = hintAction.description();
    await this.consoleClient.showInfo(
      tabId,
      `${description}: press a key to filter the hints or press Enter to select`,
    );

    const viewport = await this.topFrameClient.getWindowViewport(tabId);
    const hintKeys = new HintTagProducer(hintchars);
    const targets: HintTarget[] = [];

    for (const frameId of frameIds) {
      const framePos = await this.topFrameClient.getFramePosition(
        tabId,
        frameId,
      );
      if (!framePos) {
        continue;
      }
      const ids = await this.hintClient.lookupTargets(
        tabId,
        frameId,
        hintAction.lookupTargetSelector(),
        viewport,
        framePos,
      );
      const idTags = hintKeys.produceN(ids.length);
      const idTagMap = Object.fromEntries(ids.map((id, i) => [id, idTags[i]]));
      await this.hintClient.assignTags(tabId, frameId, idTagMap);

      for (const [element, tag] of Object.entries(idTagMap)) {
        targets.push({ frameId, element, tag });
      }
    }

    await this.hintRepository.startHintMode(
      hintModeName,
      { newTab, background },
      targets,
    );
  }

  async stop(tabId: number): Promise<void> {
    await this.hintClient.clearHints(tabId);
    await this.consoleClient.hide(tabId);
  }
}
