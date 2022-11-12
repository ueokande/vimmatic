import { injectable, inject } from "inversify";
import Key from "../../shared/Key";
import type WindowMessageSender from "./WindowMessageSender";

export default interface FollowMasterClient {
  startFollow(newTab: boolean, background: boolean): void;

  responseHintCount(count: number): void;

  sendKey(key: Key): void;
}

@injectable()
export class FollowMasterClientImpl implements FollowMasterClient {
  constructor(
    @inject("WindowMessageSender")
    private readonly sender: WindowMessageSender
  ) {}

  startFollow(newTab: boolean, background: boolean): void {
    this.sender.send("follow.start", { newTab, background });
  }

  responseHintCount(count: number): void {
    this.sender.send("follow.response.count.targets", { count });
  }

  sendKey(key: Key): void {
    this.sender.send("follow.key.press", {
      key: key.key,
      ctrlKey: key.ctrl || false,
    });
  }
}
