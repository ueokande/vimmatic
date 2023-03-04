import { injectable, inject } from "inversify";
import Operator from "../Operator";
import { OperatorContext } from "../Operator";
import ContentMessageClient from "../../clients/ContentMessageClient";
import PropertySettings from "../../settings/PropertySettings";

@injectable()
export default class ScrollToBottomOperator implements Operator {
  constructor(
    @inject("ContentMessageClient")
    private readonly contentMessageClient: ContentMessageClient,
    @inject("PropertySettings")
    private readonly propertySettings: PropertySettings
  ) {}

  name() {
    return "scroll.bottom";
  }

  schema() {}

  async run({ sender }: OperatorContext): Promise<void> {
    const smooth = await this.propertySettings.getProperty("smoothscroll");
    await this.contentMessageClient.scrollToBottom(
      sender.tabId,
      sender.frameId,
      smooth as boolean
    );
  }
}
