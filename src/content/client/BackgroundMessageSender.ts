import { Sender } from "../../messaging";
import type { Key, Request, Schema } from "../../messaging/schema/background";

export const BackgroundMessageSender = Symbol("BackgroundMessageSender");

export const newSender = () => {
  const sender = new Sender<Schema>((type: Key, args: Request) => {
    if (process.env.NODE_ENV === "development") {
      const style = "background-color: green; color: white; padding: 4px;";
      // biome-ignore lint/suspicious/noConsole: intentional debug logging
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
