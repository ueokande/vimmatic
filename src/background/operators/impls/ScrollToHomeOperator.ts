import { inject, injectable } from "inversify";
import { ContentMessageClient } from "../../clients/ContentMessageClient";
import { PropertySettings } from "../../settings/PropertySettings";
import type { Operator, OperatorContext } from "../types";

@injectable()
export class ScrollToHomeOperator implements Operator {
  constructor(
    @inject(ContentMessageClient)
    private readonly contentMessageClient: ContentMessageClient,
    @inject(PropertySettings)
    private readonly propertySettings: PropertySettings,
  ) {}

  name() {
    return "scroll.home";
  }

  schema() {}

  async run({ sender }: OperatorContext): Promise<void> {
    const smooth = await this.propertySettings.getProperty("smoothscroll");
    await this.contentMessageClient.scrollToHome(
      sender.tabId,
      sender.frameId,
      smooth as boolean,
    );
  }
}
