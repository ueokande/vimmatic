import { injectable, inject } from "inversify";
import Operator from "../Operator";
import ContentMessageClient from "../../clients/ContentMessageClient";
import PropertySettings from "../../settings/PropertySettings";
import RequestContext from "../../infrastructures/RequestContext";

@injectable()
export default class ScrollToEndOperator implements Operator {
  constructor(
    @inject(ContentMessageClient)
    private readonly contentMessageClient: ContentMessageClient,
    @inject("PropertySettings")
    private readonly propertySettings: PropertySettings
  ) {}

  name() {
    return "scroll.end";
  }

  schema() {}

  async run({ sender }: RequestContext): Promise<void> {
    if (!sender?.tab?.id) {
      return;
    }

    const smooth = await this.propertySettings.getProperty("smoothscroll");
    await this.contentMessageClient.scrollToEnd(
      sender.tab.id,
      smooth as boolean
    );
  }
}
