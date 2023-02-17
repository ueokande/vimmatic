import { injectable, inject } from "inversify";
import { z } from "zod";
import Operator from "../Operator";
import RequestContext from "../../infrastructures/RequestContext";
import ClipboardRepository from "../../repositories/ClipboardRepository";
import SearchEngineSettings from "../../settings/SearchEngineSettings";
import * as urls from "../../../shared/urls";

@injectable()
export default class PasteOperator implements Operator {
  constructor(
    @inject("ClipboardRepository")
    private readonly clipboard: ClipboardRepository,
    @inject("SearchEngineSettings")
    private readonly searchEngineSettings: SearchEngineSettings
  ) {}

  name() {
    return "urls.paste";
  }

  schema() {
    return z.object({
      newTab: z.boolean().default(false),
    });
  }

  async run(
    { sender }: RequestContext,
    { newTab }: z.infer<ReturnType<PasteOperator["schema"]>>
  ): Promise<void> {
    if (!sender?.tab?.id) {
      return;
    }

    const text = await this.clipboard.read();
    const search = await this.searchEngineSettings.get();
    const url = urls.searchUrl(text, search);

    if (newTab) {
      await browser.tabs.create({ url });
    } else {
      await browser.tabs.update({ url });
    }
  }
}
