import { SimplexSender } from "../../messaging";
import type { Key, Schema, Request } from "../../messaging/schema/window";

type WindowMessageSender = SimplexSender<Schema>;

export const newSender = (target: Window) => {
  const sender = new SimplexSender<Schema>((type: Key, args: Request) => {
    const msg = JSON.stringify({ args, type });
    target.postMessage(msg, "*");
  });
  return sender;
};

export default WindowMessageSender;
