import { Sender } from "../../messaging";
import type { Schema, Key, Request } from "../../messaging/schema/background";

type BackgroundMessageSender = Sender<Schema>;

export const newSender = () => {
  const sender = new Sender<Schema>((type: Key, args: Request) => {
    return chrome.runtime.sendMessage({
      type,
      args: args ?? {},
    });
  });
  return sender;
};

export default BackgroundMessageSender;
