import { RepeatLastOperator } from "../../../../src/background/operators/impls/RepeatLastOperator";
import type { RepeatRepository } from "../../../../src/background/repositories/RepeatRepository";
import type { OperatorRegistry } from "../../../../src/background/operators/OperatorRegistry";
import type {
  Operator,
  OperatorContext,
} from "../../../../src/background/operators/types";
import { describe, beforeEach, it, expect, vi } from "vitest";

const todo = () => {
  throw new Error(`not implemented`);
};

describe("RepeatLastOperator", () => {
  const operatorRegistry: OperatorRegistry = {
    register: todo,
    getOperator: todo,
  };
  const repeatRepository: RepeatRepository = {
    getLastOperation: todo,
    setLastOperation: todo,
  };
  const operator: Operator = {
    name: todo,
    schema: todo,
    run: todo,
  };
  const ctx = {} as OperatorContext;
  const sut = new RepeatLastOperator(operatorRegistry, repeatRepository);

  const mockRun = vi.spyOn(operator, "run").mockResolvedValue();

  beforeEach(() => {
    mockRun.mockClear();
  });

  describe("#run", () => {
    it("repeat last operation", async () => {
      vi.spyOn(repeatRepository, "getLastOperation").mockResolvedValue({
        type: "greeting",
        props: { name: "alice" },
      });
      vi.spyOn(operatorRegistry, "getOperator").mockReturnValue(operator);

      await sut.run(ctx);

      expect(mockRun).toHaveBeenCalledWith(ctx, { name: "alice" });
    });

    it("does nothing if no last operations", async () => {
      vi.spyOn(repeatRepository, "getLastOperation").mockResolvedValue(null);

      await sut.run(ctx);

      expect(mockRun).not.toHaveBeenCalled();
    });

    it("throw an error on unknown operation is stored", async () => {
      vi.spyOn(repeatRepository, "getLastOperation").mockResolvedValue({
        type: "unknown",
        props: {},
      });
      vi.spyOn(operatorRegistry, "getOperator").mockReturnValue(undefined);

      await expect(() => sut.run(ctx)).rejects.toThrow();
    });
  });
});
