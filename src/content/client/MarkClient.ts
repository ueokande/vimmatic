import { injectable, inject } from "inversify";
import Mark from "../domains/Mark";
import type BackgroundMessageSender from "./BackgroundMessageSender";

export default interface MarkClient {
  setGloablMark(key: string, mark: Mark): Promise<void>;

  jumpGlobalMark(key: string): Promise<void>;
}

@injectable()
export class MarkClientImpl implements MarkClient {
  constructor(
    @inject("BackgroundMessageSender")
    private readonly sender: BackgroundMessageSender
  ) {}

  async setGloablMark(key: string, mark: Mark): Promise<void> {
    await this.sender.send("mark.set.global", { key, x: mark.x, y: mark.y });
  }

  async jumpGlobalMark(key: string): Promise<void> {
    await this.sender.send("mark.jump.global", { key });
  }
}
