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

    const op = { type: "do", props: { name: "alice" } };
    await sut.exec(op, 10);
    expect(mockExecBackgroundOp).toHaveBeenCalledWith(op, 10);
  });
});
