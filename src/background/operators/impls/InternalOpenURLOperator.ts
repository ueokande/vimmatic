import { injectable } from "inversify";
import { z } from "zod";
import Operator from "../Operator";
import RequestContext from "../../infrastructures/RequestContext";

@injectable()
export default class InternalOpenURLOperator implements Operator {
  name() {
    return "internal.open.url";
  }

  schema() {
    return z.object({
      url: z.string(),
      newTab: z.boolean().default(false),
      newWindow: z.boolean().default(false),
    });
  }

  async run(
    _ctx: RequestContext,
    {
      url,
      newTab,
      newWindow,
    }: z.infer<ReturnType<InternalOpenURLOperator["schema"]>>
  ): Promise<void> {
    if (newWindow) {
      await browser.windows.create({ url: url });
    } else if (newTab) {
      await browser.tabs.create({ url: url });
    } else {
      await browser.tabs.update({ url: url });
    }
  }
}
