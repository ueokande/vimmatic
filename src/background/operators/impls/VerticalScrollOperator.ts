import { inject, injectable } from "inversify";
import { z } from "zod";
import Operator from "../Operator";
import ContentMessageClient from "../../clients/ContentMessageClient";
import PropertySettings from "../../settings/PropertySettings";
import RequestContext from "../../infrastructures/RequestContext";

@injectable()
export default class VerticalScrollOperator implements Operator {
  constructor(
    @inject("ContentMessageClient")
    private readonly contentMessageClient: ContentMessageClient,
    @inject("PropertySettings")
    private readonly propertySettings: PropertySettings
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
    { sender }: RequestContext,
    { count }: z.infer<ReturnType<VerticalScrollOperator["schema"]>>
  ): Promise<void> {
    if (!sender?.tab?.id) {
      return;
    }

    const smooth = await this.propertySettings.getProperty("smoothscroll");
    await this.contentMessageClient.scrollVertically(
      sender.tab.id,
      count,
      smooth as boolean
    );
  }
}
