import type { Schema, Key, Request } from "../../messaging/schema/content";
import { Sender } from "../../messaging";

type ContentMessageSender = Sender<Schema>;

export const newSender = (tabId: number, frameId?: number) => {
  const sender = new Sender<Schema>((type: Key, args: Request) => {
    if (process.env.NODE_ENV === "development") {
      const style = "background-color: green; color: white; padding: 4px;";
      const reset = "background-color: unset; color: unset; padding: unset;";
      console.debug("%cSEND%c %s %o", style, reset, type, args);
    }

    const msg = { type, args: args ?? {} };
    return chrome.tabs.sendMessage(tabId, msg, { frameId });
  });
  return sender;
};

export default ContentMessageSender;
