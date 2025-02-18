import type { Property, PropertyType } from "./types";

enum VisualMode {
    Visual = "visual"
}


export class VisualModeProperty implements Property {
    name() {
        return "visualmode"
    }


    description() {
        return "Visual Mode"
    }

    type() {
        return "string" as const
    }

    defaultValue () {
        return VisualMode.Visual
    }

    validate (value: PropertyType) {
        if (value == VisualMode.Visual) {
            return;
        }

        throw new Error(`invalid color scheme: ${value}`) 
    }
}
