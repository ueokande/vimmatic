import { z } from "zod";

export const SerializedKeymapsSchema = z.record(
  z
    .object({ type: z.string() })
    .and(z.record(z.union([z.string(), z.number(), z.boolean()])))
);
export const SerializedSearchEngineSchema = z.object({
  default: z.string(),
  engines: z.record(z.string()),
});
export const SerializedPropertiesSchema = z.record(
  z.union([z.string(), z.number(), z.boolean()])
);
export const SerializedBlacklistSchema = z
  .union([z.string(), z.object({ url: z.string(), keys: z.string().array() })])
  .array();
export const SerializedStyles = z.object({
  hint: z.record(z.string()).optional(),
  console: z.record(z.string()).optional(),
});
export const SerializedSettingsSchema = z.object({
  keymaps: z.optional(SerializedKeymapsSchema),
  search: z.optional(SerializedSearchEngineSchema),
  properties: z.optional(SerializedPropertiesSchema),
  blacklist: z.optional(SerializedBlacklistSchema),
  styles: z.optional(SerializedStyles),
});

export type SerializedKeymaps = z.infer<typeof SerializedKeymapsSchema>;
export type SerializedSearchEngine = z.infer<
  typeof SerializedSearchEngineSchema
>;
export type SerializedProperties = z.infer<typeof SerializedPropertiesSchema>;
export type SerializedBlacklist = z.infer<typeof SerializedBlacklistSchema>;
export type SerializedStyles = z.infer<typeof SerializedStyles>;
export type SerializedSettings = z.infer<typeof SerializedSettingsSchema>;

export const validateSerializedSettings = (json: unknown): void => {
  const result = SerializedSettingsSchema.safeParse(json);
  if (!result.success) {
    const [issue] = result.error.issues;
    const path = "." + issue.path.join(".");
    const message = `Invalid settings at "${path}": ${issue.message}`;

    throw new TypeError(message);
  }
};
