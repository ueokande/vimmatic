import { injectable, inject } from "inversify";
import Operator from "../Operator";
import ContentMessageClient from "../../clients/ContentMessageClient";
import PropertySettings from "../../settings/PropertySettings";
import RequestContext from "../../infrastructures/RequestContext";

@injectable()
export default class ScrollToTopOperator implements Operator {
  constructor(
    @inject("ContentMessageClient")
    private readonly contentMessageClient: ContentMessageClient,
    @inject("PropertySettings")
    private readonly propertySettings: PropertySettings
  ) {}

  name() {
    return "scroll.top";
  }

  schema() {}

  async run({ sender }: RequestContext): Promise<void> {
    const smooth = await this.propertySettings.getProperty("smoothscroll");
    await this.contentMessageClient.scrollToTop(
      sender.tabId,
      sender.frameId,
      smooth as boolean
    );
  }
}
