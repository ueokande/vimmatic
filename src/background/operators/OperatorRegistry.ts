import type { Operator } from "./types";

export interface OperatorRegistry {
  register(op: Operator): void;

  getOperator(name: string): Operator | undefined;
}

export const OperatorRegistry = Symbol("OperatorRegistry");

export class OperatorRegistryImpl {
  private readonly operatorNames: Map<string, Operator> = new Map();

  register(operator: Operator): void {
    this.operatorNames.set(operator.name(), operator);
  }

  getOperator(name: string): Operator | undefined {
    return this.operatorNames.get(name);
  }
}
