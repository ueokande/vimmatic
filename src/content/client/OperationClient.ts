import { injectable, inject } from "inversify";
import type BackgroundMessageSender from "./BackgroundMessageSender";

export default interface OperationClient {
  execBackgroundOp(
    name: string,
    props: Record<string, string | number | boolean>,
    repeat: number
  ): Promise<void>;

  internalOpenUrl(
    url: string,
    newTab?: boolean,
    background?: boolean
  ): Promise<void>;
}

@injectable()
export class OperationClientImpl implements OperationClient {
  constructor(
    @inject("BackgroundMessageSender")
    private readonly sender: BackgroundMessageSender
  ) {}

  async execBackgroundOp(
    name: string,
    props: Record<string, string | number | boolean>,
    repeat: number
  ): Promise<void> {
    await this.sender.send("background.operation", { name, props, repeat });
  }

  async internalOpenUrl(
    url: string,
    newTab?: boolean,
    background?: boolean
  ): Promise<void> {
    const props: Record<string, string | number | boolean> = { url };
    if (typeof newTab !== "undefined") {
      props.newTab = newTab;
    }
    if (typeof background !== "undefined") {
      props.background = background;
    }
    await this.sender.send("background.operation", {
      name: "internal.open.url",
      props,
      repeat: 1,
    });
  }
}
