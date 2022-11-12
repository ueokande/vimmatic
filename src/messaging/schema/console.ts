import { MessageKey, MessageRequest, MessageResponse } from "./helper";
import { Duplex } from "../types";

export type Schema = {
  "console.show.command": Duplex<{ command: string }>;
  "console.show.error": Duplex<{ text: string }>;
  "console.show.info": Duplex<{ text: string }>;
  "console.show.find": Duplex;
  "console.hide": Duplex;
};

export type Key = MessageKey<Schema>;
export type Request = MessageRequest<Schema>;
export type Response = MessageResponse<Schema>;
