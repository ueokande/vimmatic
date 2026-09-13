import { inject, injectable } from "inversify";
import { z } from "zod";
import { ContentMessageClient } from "../../clients/ContentMessageClient";
import { PropertySettings } from "../../settings/PropertySettings";
import type { Operator, OperatorContext } from "../types";

@injectable()
export class HorizontalScrollOperator implements Operator {
  constructor(
    @inject(ContentMessageClient)
    private readonly contentMessageClient: ContentMessageClient,
    @inject(PropertySettings)
    private readonly propertySettings: PropertySettings,
  ) {}

  name() {
    return "scroll.horizonally";
  }

  schema() {
    return z.object({
      count: z.number().default(1),
    });
  }

  async run(
    { sender }: OperatorContext,
    { count }: z.infer<ReturnType<HorizontalScrollOperator["schema"]>>,
  ): Promise<void> {
    const smooth = await this.propertySettings.getProperty("smoothscroll");
    await this.contentMessageClient.scrollHorizonally(
      sender.tabId,
      sender.frameId,
      count,
      smooth as boolean,
    );
  }
}
