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
  "settings.changed": Duplex;
  "scroll.vertically": Duplex<{ amount: number; smooth: boolean }>;
  "scroll.horizonally": Duplex<{ amount: number; smooth: boolean }>;
  "scroll.pages": Duplex<{ amount: number; smooth: boolean }>;
  "scroll.top": Duplex<{ smooth: boolean }>;
  "scroll.bottom": Duplex<{ smooth: boolean }>;
  "scroll.home": Duplex<{ smooth: boolean }>;
  "scroll.end": Duplex<{ smooth: boolean }>;
  "scroll.to": Duplex<{ x: number; y: number; smooth: boolean }>;
  "get.scroll": Duplex<undefined, { x: number; y: number }>;
  "focus.input": Duplex;
  "enable.key.capture": Duplex;
  "disable.key.capture": Duplex;
};

export type Key = MessageKey<Schema>;
export type Request = MessageRequest<Schema>;
export type Response = MessageResponse<Schema>;
