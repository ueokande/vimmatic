import RepeatLastOperator from "../../../../src/background/operators/impls/RepeatLastOperator";
import OperatorRegistory from "../../../../src/background/operators/OperatorRegistory";
import RepeatRepository from "../../../../src/background/repositories/RepeatRepository";
import Operator from "../../../../src/background/operators/Operator";

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
  const sut = new RepeatLastOperator(operatorRegistory, repeatRepository);

  const mockRun = jest.spyOn(operator, "run").mockResolvedValue();

  beforeEach(() => {
    mockRun.mockClear();
  });

  describe("#run", () => {
    it("repeat last operation", async () => {
      jest.spyOn(repeatRepository, "getLastOperation").mockReturnValue({
        type: "greeting",
        name: "alice",
      });
      jest.spyOn(operatorRegistory, "getOperator").mockReturnValue(operator);

      await sut.run();

      expect(mockRun).toBeCalledWith({ name: "alice" });
    });

    it("does nothing if no last operations", async () => {
      jest
        .spyOn(repeatRepository, "getLastOperation")
        .mockReturnValue(undefined);

      await sut.run();

      expect(mockRun).not.toBeCalled();
    });

    it("throw an error on unknown operation is stored", async () => {
      jest.spyOn(repeatRepository, "getLastOperation").mockReturnValue({
        type: "unknown",
      });
      jest.spyOn(operatorRegistory, "getOperator").mockReturnValue(undefined);

      expect(() => sut.run()).toThrowError();
    });
  });
});
