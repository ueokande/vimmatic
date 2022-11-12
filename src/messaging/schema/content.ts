import { MessageKey, MessageRequest, MessageResponse } from "./helper";
import { Duplex } from "../types";

export type Schema = {
  "addon.enabled.query": Duplex<undefined, boolean>;
  "addon.toggle.enabled": Duplex;
  "console.hide": Duplex;
  "console.resize": Duplex<{ width: number; height: number }>;
  "find.next": Duplex<{ keyword: string }, boolean>;
  "find.prev": Duplex<{ keyword: string }, boolean>;
  "find.clear.selection": Duplex;
  "navigate.history.next": Duplex;
  "navigate.history.prev": Duplex;
  "navigate.link.next": Duplex;
  "navigate.link.prev": Duplex;
  "tab.scroll.to": Duplex<{ x: number; y: number }>;
  "settings.changed": Duplex;
};

export type Key = MessageKey<Schema>;
export type Request = MessageRequest<Schema>;
export type Response = MessageResponse<Schema>;
