import type { Schema, Key, Request } from "../../messaging/schema/content";
import { Sender } from "../../messaging";

// Sends a message to a content script.  The receiving frame is guaranteed to be
// listening because the background only ever sends to frames that are present
// in `ReadyFrameRepository`, and a frame is registered there only after its
// content script has finished installing its `chrome.runtime.onMessage`
// listener (see `content/Application.ts`).  Therefore no retry is performed
// here; a failure is a genuine error (e.g. the frame has already navigated
// away) and is surfaced to the caller.
export const newSender = (tabId: number, frameId?: number) => {
  const sender = new Sender<Schema>((type: Key, args: Request) => {
    if (process.env.NODE_ENV === "development") {
      const style = "background-color: green; color: white; padding: 4px;";
      const reset = "background-color: unset; color: unset; padding: unset;";
      // eslint-disable-next-line no-console
      console.debug("%cSEND%c %s %o", style, reset, type, args);
    }

    const msg = { type, args: args ?? {} };
    return chrome.tabs.sendMessage(tabId, msg, { frameId });
  });
  return sender;
};

export type ContentMessageSender = Sender<Schema>;
