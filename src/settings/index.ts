import { defaultJSONSettings } from "./default";
import {
  serializeSettings as serialize,
  deserializeSettings as deserialize,
} from "./serdes";

const defaultSettings = deserialize(JSON.parse(defaultJSONSettings));

export { serialize, deserialize, defaultSettings, defaultJSONSettings };
