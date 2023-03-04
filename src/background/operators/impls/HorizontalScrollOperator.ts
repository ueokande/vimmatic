import { injectable, inject } from "inversify";
import { z } from "zod";
import Operator from "../Operator";
import { OperatorContext } from "../Operator";
import ContentMessageClient from "../../clients/ContentMessageClient";
import PropertySettings from "../../settings/PropertySettings";

@injectable()
export default class HorizontalScrollOperator implements Operator {
  constructor(
    @inject("ContentMessageClient")
    private readonly contentMessageClient: ContentMessageClient,
    @inject("PropertySettings")
    private readonly propertySettings: PropertySettings
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
    { count }: z.infer<ReturnType<HorizontalScrollOperator["schema"]>>
  ): Promise<void> {
    const smooth = await this.propertySettings.getProperty("smoothscroll");
    await this.contentMessageClient.scrollHorizonally(
      sender.tabId,
      sender.frameId,
      count,
      smooth as boolean
    );
  }
}
