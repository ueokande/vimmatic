import OperationUseCase from "../../../src/content/usecases/OperationUseCase";
import OperatorRegistory from "../../../src/content/operators/OperatorRegistory";
import OperationClient from "../../../src/content/client/OperationClient";
import Operator from "../../../src/content/operators/Operator2";
import { z } from "zod";

const todo = () => {
  throw new Error(`not implemented`);
};

describe("OperationUseCase", () => {
  const operatorRegistory: OperatorRegistory = {
    register: todo,
    getOperator: todo,
  };
  const operationClient: OperationClient = {
    execBackgroundOp: todo,
  };
  const operator: Operator = {
    name: todo,
    schema: todo,
    run: todo,
  };
  const sut = new OperationUseCase(operatorRegistory, operationClient);

  const mockGetOperator = jest.spyOn(operatorRegistory, "getOperator");
  const mockExecBackgroundOp = jest.spyOn(operationClient, "execBackgroundOp");
  const mockRun = jest.spyOn(operator, "run");
  const mockSchema = jest.spyOn(operator, "schema");

  beforeEach(() => {
    mockGetOperator.mockClear();
    mockExecBackgroundOp.mockClear();
    mockRun.mockClear();
    mockSchema.mockClear();
  });

  it("exec an operation", async () => {
    mockGetOperator.mockReturnValue(operator);
    mockRun.mockResolvedValue();
    mockSchema.mockReturnValue(z.object({ name: z.string() }));

    await sut.exec("do", { name: "alice" }, 10);

    expect(mockRun).toHaveBeenCalledTimes(10);
    expect(mockRun).toHaveBeenCalledWith({ name: "alice" });
  });

  it("fails schema validation", async () => {
    mockGetOperator.mockReturnValue(operator);
    mockRun.mockResolvedValue();
    mockSchema.mockReturnValue(z.object({ name: z.string() }));

    await expect(sut.exec("do", { age: 14 }, 1)).rejects.toThrowError();
  });

  it("exec an background operation on the background script", async () => {
    mockGetOperator.mockReturnValue(undefined);
    mockExecBackgroundOp.mockResolvedValue();

    await sut.exec("do", { name: "alice" }, 10);

    expect(mockExecBackgroundOp).toBeCalledWith("do", { name: "alice" }, 10);
  });
});
