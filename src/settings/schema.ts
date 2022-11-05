import validate from "./validate";
import type * as Ajv from "ajv";

export type SerializedKeymaps = Record<
  string,
  { type: string } & Record<string, string | number | boolean>
>;
export type SerializedSearchEngine = {
  default: string;
  engines: Record<string, string>;
};
export type SerializedProperties = Record<string, string | number | boolean>;
export type SerializedBlacklist = Array<
  string | { url: string; keys: Array<string> }
>;
export type SerializedSettings = {
  keymaps?: SerializedKeymaps;
  search?: SerializedSearchEngine;
  properties?: SerializedProperties;
  blacklist?: SerializedBlacklist;
};

export const validateSerializedSettings = (json: unknown): void => {
  const valid = validate(json);
  if (!valid) {
    const message = (validate as any)
      .errors!.map((err: Ajv.ErrorObject) => {
        return `'${err.instancePath}' ${err.message}`;
      })
      .join("; ");

    throw new TypeError(message);
  }
};
