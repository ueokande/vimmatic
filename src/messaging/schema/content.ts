import { MessageKey, MessageRequest, MessageResponse } from "./helper";
import { Duplex } from "../types";
import type Mode from "../../shared/Mode";

export type Schema = {
  "addon.enable": Duplex;
  "addon.disable": Duplex;
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
  "set.mode": Duplex<{ mode: Mode }>;
  "notify.frame.id": Duplex<{ frameId: number }>;

  "get.window.viewport": Duplex<undefined, { width: number; height: number }>;
  "get.frame.position": Duplex<
    { frameId: number },
    { x: number; y: number } | undefined
  >;
  "follow.count.hints": Duplex<
    {
      viewSize: { width: number; height: number };
      framePosition: { x: number; y: number };
    },
    number
  >;
  "follow.create.hints": Duplex<{
    viewSize: { width: number; height: number };
    framePosition: { x: number; y: number };
    hints: string[];
  }>;
  "follow.filter.hints": Duplex<{ prefix: string }>;
  "follow.remove.hints": Duplex;
  "follow.activate": Duplex<{
    hint: string;
    newTab: boolean;
    background: boolean;
  }>;
};

export type Key = MessageKey<Schema>;
export type Request = MessageRequest<Schema>;
export type Response = MessageResponse<Schema>;
