import { injectable, inject } from "inversify";
import type { Operator, OperatorContext } from "../types";
import type { ContentMessageClient } from "../../clients/ContentMessageClient";
import type { PropertySettings } from "../../settings/PropertySettings";

@injectable()
export default class ScrollToEndOperator implements Operator {
  constructor(
    @inject("ContentMessageClient")
    private readonly contentMessageClient: ContentMessageClient,
    @inject("PropertySettings")
    private readonly propertySettings: PropertySettings,
  ) {}

  name() {
    return "scroll.end";
  }

  schema() {}

  async run({ sender }: OperatorContext): Promise<void> {
    const smooth = await this.propertySettings.getProperty("smoothscroll");
    await this.contentMessageClient.scrollToEnd(
      sender.tabId,
      sender.frameId,
      smooth as boolean,
    );
  }
}
