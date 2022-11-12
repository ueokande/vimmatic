import type { Schema, Key, Request } from "../../messaging/schema/content";
import { Sender } from "../../messaging";

type ContentMessageSender = Sender<Schema>;

export const newSender = (tabId: number, frameId?: number) => {
  const sender = new Sender<Schema>((type: Key, args: Request) => {
    const msg = { type, args: args ?? {} };
    return browser.tabs.sendMessage(tabId, msg, { frameId });
  });
  return sender;
};

export default ContentMessageSender;
