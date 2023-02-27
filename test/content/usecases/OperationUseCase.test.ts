import OperationUseCase from "../../../src/content/usecases/OperationUseCase";
import OperationClient from "../../../src/content/client/OperationClient";

const todo = () => {
  throw new Error(`not implemented`);
};

describe("OperationUseCase", () => {
  const operationClient: OperationClient = {
    execBackgroundOp: todo,
  };
  const sut = new OperationUseCase(operationClient);

  const mockExecBackgroundOp = jest.spyOn(operationClient, "execBackgroundOp");

  beforeEach(() => {
    mockExecBackgroundOp.mockClear();
  });

  it("exec an background operation on the background script", async () => {
    mockExecBackgroundOp.mockResolvedValue();

    await sut.exec("do", { name: "alice" }, 10);

    expect(mockExecBackgroundOp).toBeCalledWith("do", { name: "alice" }, 10);
  });
});
