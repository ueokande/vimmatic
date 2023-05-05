import { MessageKey, MessageRequest, MessageResponse } from "./helper";
import type { Completions } from "../../shared/Completions";
import { Duplex } from "../types";

export type Schema = {
  "typeof addon.enabled.response": Duplex<{ enabled: boolean }>;
  "console.frame.message": Duplex<{ message: any }>;
  "background.operation": Duplex<{
    repeat: number;
    name: string;
    props: Record<string, string | number | boolean>;
  }>;
  "settings.query": Duplex<undefined, unknown>;
  "open.url": Duplex<{ url: string; newTab: boolean; background: boolean }>;
  "console.command.enter": Duplex<{ text: string }>;
  "console.command.completions": Duplex<{ query: string }, Completions>;
  "console.find.enter": Duplex<{ keyword?: string }>;
  "console.find.completions": Duplex<{ query: string }, Completions>;
  "console.resize": Duplex<{ width: number; height: number }>;
  "settings.get.property": Duplex<{ name: string }, string | number | boolean>;
  "settings.get.style": Duplex<{ name: string }, Record<string, string>>;
  "settings.validate": Duplex<{ settings: unknown }, { error?: string }>;
  "press.key": Duplex<{ key: string }>;
};

export type Key = MessageKey<Schema>;
export type Request = MessageRequest<Schema>;
export type Response = MessageResponse<Schema>;
