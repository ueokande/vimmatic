import Operator from "./Operator";

export default interface OperatorRegistory {
  register(op: Operator): void;

  getOperator(name: string): Operator | undefined;
}

export class OperatorRegistryImpl {
  private readonly operators: Operator[] = [];

  private readonly operatorNames: Map<string, Operator> = new Map();

  register(operator: Operator): void {
    this.operators.push(operator);
    this.operatorNames.set(operator.name(), operator);
  }

  getOperator(name: string): Operator | undefined {
    return this.operatorNames.get(name);
  }
}
