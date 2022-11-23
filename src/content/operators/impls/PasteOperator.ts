import { injectable, inject } from "inversify";
import { z } from "zod";
import Operator from "../Operator";
import ClipboardRepository from "../../repositories/ClipboardRepository";
import SettingRepository from "../../repositories/SettingRepository";
import OperationClient from "../../client/OperationClient";
import * as urls from "../../../shared/urls";

@injectable()
export default class PasteOperator implements Operator {
  constructor(
    @inject("ClipboardRepository")
    private readonly repository: ClipboardRepository,
    @inject("SettingRepository")
    private readonly settingRepository: SettingRepository,
    @inject("OperationClient")
    private readonly operationClient: OperationClient
  ) {}

  name() {
    return "urls.paste";
  }

  schema() {
    return z.object({
      newTab: z.boolean().default(false),
    });
  }

  async run({
    newTab,
  }: z.infer<ReturnType<PasteOperator["schema"]>>): Promise<void> {
    const search = this.settingRepository.getSearch();
    const text = this.repository.read();
    const url = urls.searchUrl(text, search);

    // NOTE: Repeat pasting from clipboard instead of opening a certain url.
    // 'Repeat last' command is implemented in the background script and cannot
    // access to clipboard until Firefox 63.
    await this.operationClient.internalOpenUrl(url, newTab);
  }
}
