import {injectable, inject } from "inversify";
import { ReadyFrameRepository } from "../repositories/ReadyFrameRepository";
import { PropertySettings } from "../settings/PropertySettings";
import { TopFrameClient } from "../clients/TopFrameClient";



@injectable()
export class VisualModeUseCase {
    constructor(
        @inject(TopFrameClient)
        private readonly topFrameClient: TopFrameClient,
        @inject(ReadyFrameRepository)
        private readonly frameRepository: ReadyFrameRepository,
        @inject(PropertySettings)
        private readonly propertySettings: PropertySettings,
    ) {}
    

  async start(
      tabId: number, 
      visualModeName: string 
    ): Promise<void> {
    const frameIds = await this.frameRepository.getFrameIds(tabId);
    if (typeof frameIds === "undefined") {
        return;
      }
    }
}
