import { MessageKey, MessageRequest } from "./helper";
import { Simplex } from "../types";

export type Schema = {
  "console.unfocus": Simplex;
  "follow.start": Simplex<{ newTab: boolean; background: boolean }>;
  "follow.response.count.targets": Simplex<{ count: number }>;
  "follow.request.count.targets": Simplex<{
    viewSize: { width: number; height: number };
    framePosition: { x: number; y: number };
  }>;
  "follow.create.hints": Simplex<{
    tags: string[];
    viewSize: { width: number; height: number };
    framePosition: { x: number; y: number };
  }>;
  "follow.show.hints": Simplex<{ prefix: string }>;
  "follow.remove.hints": Simplex;
  "follow.activate": Simplex<{
    tag: string;
    newTab: boolean;
    background: boolean;
  }>;
  "follow.key.press": Simplex<{ key: string; ctrlKey: boolean }>;
};

export type Key = MessageKey<Schema>;
export type Request = MessageRequest<Schema>;
