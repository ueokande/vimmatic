import type { MessageKey, MessageRequest, MessageResponse } from "./helper";
import type { Duplex } from "../types";
import type { Mode } from "../../shared/mode";
import type { HTMLElementType } from "../../shared/HTMLElementType";
import type { FindQuery } from "../../shared/findQuery";

export type Schema = {
  "addon.enable": Duplex;
  "addon.disable": Duplex;
  "console.hide": Duplex;
  "console.resize": Duplex<{ width: number; height: number }>;
  "visual.left": Duplex<{ amount: number }>;
  "visual.right": Duplex<{ amount: number }>;
  "visual.word.next": Duplex<{ amount: number }>;
  "visual.word.end": Duplex<{ amount: number }>;
  "visual.word.back": Duplex<{ amount: number }>;
  "find.next": Duplex<FindQuery, boolean>;
  "find.prev": Duplex<FindQuery, boolean>;
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
  "hint.lookup": Duplex<
    {
      cssSelector: string;
      viewSize: { width: number; height: number };
      framePosition: { x: number; y: number };
    },
    { elements: string[] }
  >;
  "hint.assign": Duplex<{
    elementTags: Record<string, string>;
  }>;
  "hint.show": Duplex<{
    elements: string[];
  }>;
  "hint.clear": Duplex;
  "hint.getElement": Duplex<
    {
      element: string;
    },
    HTMLElementType | undefined
  >;
  "hint.focus": Duplex<{ element: string }>;
  "hint.click": Duplex<{ element: string }>;
};

export type Key = MessageKey<Schema>;
export type Request = MessageRequest<Schema>;
export type Response = MessageResponse<Schema>;
