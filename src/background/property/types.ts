export type PropertyType = string | number | boolean;
export type PropertyTypeName = "string" | "number" | "boolean";

export interface Property {
  name(): string;

  description(): string;

  type(): PropertyTypeName;

  defaultValue(): PropertyType;

  validate(value: PropertyType): void;
}
