import { defaultJSONSettings } from "./default";
import {
  deserializeSettings as deserialize,
  serializeSettings as serialize,
} from "./serdes";

const defaultSettings = deserialize(JSON.parse(defaultJSONSettings));

export { defaultJSONSettings, defaultSettings, deserialize, serialize };
