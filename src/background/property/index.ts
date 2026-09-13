import { ColorSchemeProperty } from "./ColorSchemeProperty";
import { CompleteProperty } from "./CompleteProperty";
import { FindModeProperty } from "./FindModeProperty";
import { HintcharsProperty } from "./HintcharsProperty";
import { IgnoreCaseProperty } from "./IgnoreCaseProperty";
import type { PropertyRegistry } from "./PropertyRegistry";
import { PropertyRegistryImpl } from "./PropertyRegistry";
import { SmoothScrollProperty } from "./SmoothScrollProperty";

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
