import { serialize, deserialize, defaultJSONSettings } from "../settings";
import { Sender } from "../messaging";
import type {
  Schema as BackgroundMessageSchema,
  Key as BackgroundMessageKey,
  Request as BackgroundMessageRequest,
} from "../messaging/schema/background";
import Settings from "../shared/Settings";

export const settingsFromJson = (text: string): Settings => {
  const json = JSON.parse(text);
  return deserialize(json);
};

const backgroundMessageSender = new Sender<BackgroundMessageSchema>(
  (type: BackgroundMessageKey, args: BackgroundMessageRequest) => {
    return browser.runtime.sendMessage({
      type,
      args: args ?? {},
    });
  }
);

export const saveText = async (text: string): Promise<void> => {
  const settings = settingsFromJson(text);
  const { error } = await backgroundMessageSender.send("settings.validate", {
    settings: serialize(settings),
  });
  if (typeof error !== "undefined") {
    throw new Error(error);
  }
  return browser.storage.sync.set({
    settings: serialize(settings),
    settings_text: text,
  });
};

export const loadText = async (): Promise<string> => {
  const { settings_text: text } = await browser.storage.sync.get(
    "settings_text"
  );
  if (!text) {
    return defaultJSONSettings;
  }
  return text;
};
