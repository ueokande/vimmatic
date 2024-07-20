import { ColorSchemeProperty } from "./ColorSchemeProperty";
import { CompleteProperty } from "./CompleteProperty";
import { HintcharsProperty } from "./HintcharsProperty";
import { SmoothScrollProperty } from "./SmoothScrollProperty";
import { IgnoreCaseProperty } from "./IgnoreCaseProperty";
import { FindModeProperty } from "./FindModeProperty";
import {
  type PropertyRegistry,
  PropertyRegistryImpl,
} from "./PropertyRegistry";

export const createPropertyRegistry = (): PropertyRegistry => {
  const r = new PropertyRegistryImpl();
  r.register(new HintcharsProperty());
  r.register(new SmoothScrollProperty());
  r.register(new CompleteProperty());
  r.register(new ColorSchemeProperty());
  r.register(new IgnoreCaseProperty());
  r.register(new FindModeProperty());
  return r;
};
