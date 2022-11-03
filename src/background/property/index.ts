import ColorSchemeProperty from "./ColorSchemeProperty";
import CompleteProperty from "./CompleteProperty";
import HintcharsProperty from "./HintcharsProperty";
import SmoothScrollProperty from "./SmoothScrollProperty";
import PropertyRegistry, { PropertyRegistryImpl } from "./PropertyRegistry";

export class PropertyRegistryFactry {
  create(): PropertyRegistry {
    const r = new PropertyRegistryImpl();
    r.register(new HintcharsProperty());
    r.register(new SmoothScrollProperty());
    r.register(new CompleteProperty());
    r.register(new ColorSchemeProperty());
    return r;
  }
}
