import type { Simplex } from "../types";
import type { MessageKey, MessageRequest } from "./helper";

export type Schema = {
  "console.unfocus": Simplex;
  "console.ready": Simplex;
  "notify.frame.id": Simplex<{ frameId: number }>;
};

export type Key = MessageKey<Schema>;
export type Request = MessageRequest<Schema>;
