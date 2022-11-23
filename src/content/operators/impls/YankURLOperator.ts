import { injectable, inject } from "inversify";
import Operator from "../Operator";
import ClipboardRepository from "../../repositories/ClipboardRepository";
import ConsoleClient from "../../client/ConsoleClient";
import URLRepository from "./URLRepository";

@injectable()
export default class YankURLOperator implements Operator {
  constructor(
    @inject("ClipboardRepository")
    private readonly repository: ClipboardRepository,
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient,
    @inject("URLRepository")
    private readonly urlRepository: URLRepository
  ) {}

  name() {
    return "urls.yank";
  }

  schema() {}

  async run(): Promise<void> {
    const url = this.urlRepository.getCurrentURL();
    this.repository.write(url);
    await this.consoleClient.info("Yanked " + url);
  }
}
