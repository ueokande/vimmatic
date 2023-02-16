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
  "scroll.vertically": Duplex<{ amount: number; smooth: boolean }>;
  "scroll.horizonally": Duplex<{ amount: number; smooth: boolean }>;
  "scroll.pages": Duplex<{ amount: number; smooth: boolean }>;
  "scroll.top": Duplex<{ smooth: boolean }>;
  "scroll.bottom": Duplex<{ smooth: boolean }>;
  "scroll.home": Duplex<{ smooth: boolean }>;
  "scroll.end": Duplex<{ smooth: boolean }>;
};

export type Key = MessageKey<Schema>;
export type Request = MessageRequest<Schema>;
export type Response = MessageResponse<Schema>;
