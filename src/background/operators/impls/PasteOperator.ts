import { injectable, inject } from "inversify";
import { z } from "zod";
import type { Operator, OperatorContext } from "../types";
import type { ClipboardRepository } from "../../repositories/ClipboardRepository";
import type { SearchEngineSettings } from "../../settings/SearchEngineSettings";
import * as urls from "../../../shared/urls";

@injectable()
export class PasteOperator implements Operator {
  constructor(
    @inject("ClipboardRepository")
    private readonly clipboard: ClipboardRepository,
    @inject("SearchEngineSettings")
    private readonly searchEngineSettings: SearchEngineSettings,
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
    _ctx: OperatorContext,
    { newTab }: z.infer<ReturnType<PasteOperator["schema"]>>,
  ): Promise<void> {
    const text = await this.clipboard.read();
    const search = await this.searchEngineSettings.get();
    const url = urls.searchUrl(text, search);

    if (newTab) {
      await chrome.tabs.create({ url });
    } else {
      await chrome.tabs.update({ url });
    }
  }
}
