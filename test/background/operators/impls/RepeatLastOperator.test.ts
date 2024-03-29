import RepeatLastOperator from "../../../../src/background/operators/impls/RepeatLastOperator";
import type { RepeatRepository } from "../../../../src/background/repositories/RepeatRepository";
import type { OperatorRegistory } from "../../../../src/background/operators/OperatorRegistory";
import type {
  Operator,
  OperatorContext,
} from "../../../../src/background/operators/types";

const todo = () => {
  throw new Error(`not implemented`);
};

describe("RepeatLastOperator", () => {
  const operatorRegistory: OperatorRegistory = {
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
  const sut = new RepeatLastOperator(operatorRegistory, repeatRepository);

  const mockRun = jest.spyOn(operator, "run").mockResolvedValue();

  beforeEach(() => {
    mockRun.mockClear();
  });

  describe("#run", () => {
    it("repeat last operation", async () => {
      jest.spyOn(repeatRepository, "getLastOperation").mockResolvedValue({
        type: "greeting",
        props: { name: "alice" },
      });
      jest.spyOn(operatorRegistory, "getOperator").mockReturnValue(operator);

      await sut.run(ctx);

      expect(mockRun).toHaveBeenCalledWith(ctx, { name: "alice" });
    });

    it("does nothing if no last operations", async () => {
      jest.spyOn(repeatRepository, "getLastOperation").mockResolvedValue(null);

      await sut.run(ctx);

      expect(mockRun).not.toHaveBeenCalled();
    });

    it("throw an error on unknown operation is stored", async () => {
      jest.spyOn(repeatRepository, "getLastOperation").mockResolvedValue({
        type: "unknown",
        props: {},
      });
      jest.spyOn(operatorRegistory, "getOperator").mockReturnValue(undefined);

      await expect(() => sut.run(ctx)).rejects.toThrow();
    });
  });
});
