import { inject, injectable } from "inversify";
import { z } from "zod";
import type { Operator, OperatorContext } from "../types";
import { ContentMessageClient } from "../../clients/ContentMessageClient";
import { PropertySettings } from "../../settings/PropertySettings";

@injectable()
export class VerticalScrollOperator implements Operator {
  constructor(
    @inject(ContentMessageClient)
    private readonly contentMessageClient: ContentMessageClient,
    @inject(PropertySettings)
    private readonly propertySettings: PropertySettings,
  ) {}

  name() {
    return "scroll.vertically";
  }

  schema() {
    return z.object({
      count: z.number().default(1),
    });
  }

  async run(
    { sender }: OperatorContext,
    { count }: z.infer<ReturnType<VerticalScrollOperator["schema"]>>,
  ): Promise<void> {
    const smooth = await this.propertySettings.getProperty("smoothscroll");
    await this.contentMessageClient.scrollVertically(
      sender.tabId,
      sender.frameId,
      count,
      smooth as boolean,
    );
  }
}
