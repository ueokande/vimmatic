import type { Schema, Key, Request } from "../../messaging/schema/console";
import { Sender } from "../../messaging";

type ConsoleMessageSender = Sender<Schema>;

export const newSender = (tabId: number, frameId?: number) => {
  const sender = new Sender<Schema>((type: Key, args: Request) => {
    const msg = { type, args: args ?? {} };
    return chrome.tabs.sendMessage(tabId, msg, { frameId });
  });
  return sender;
};

export default ConsoleMessageSender;
