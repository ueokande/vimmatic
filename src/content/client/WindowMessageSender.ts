import { SimplexSender } from "../../messaging";
import type { Key, Schema, Request } from "../../messaging/schema/window";

export const WindowMessageSender = Symbol("WindowMessageSender");

/**
 * The window.postMessage() is used to identify a frame id of the <iframe>
 * element through the background script.  Only Firefox supports to get the
 * frame id of the <iframe> elementa and the other browsers do not support.
 *
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/getFrameId
 */
export const newSender = (target: Window) => {
  const sender = new SimplexSender<Schema>((type: Key, args: Request) => {
    const msg = JSON.stringify({ args, type });
    target.postMessage(msg, "*");
  });
  return sender;
};

export type WindowMessageSender = SimplexSender<Schema>;
