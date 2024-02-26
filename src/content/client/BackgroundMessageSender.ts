import { Sender } from "../../messaging";
import type { Schema, Key, Request } from "../../messaging/schema/background";

export const newSender = () => {
  const sender = new Sender<Schema>((type: Key, args: Request) => {
    if (process.env.NODE_ENV === "development") {
      const style = "background-color: green; color: white; padding: 4px;";
      // eslint-disable-next-line no-console
      console.debug("%cSEND%c %s %o", style, "", type, args);
    }

    return chrome.runtime.sendMessage({
      type,
      args: args ?? {},
    });
  });
  return sender;
};

export type BackgroundMessageSender = Sender<Schema>;
