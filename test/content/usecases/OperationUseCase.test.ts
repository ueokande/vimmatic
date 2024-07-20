import { OperationUseCase } from "../../../src/content/usecases/OperationUseCase";
import type { OperationClient } from "../../../src/content/client/OperationClient";
import { describe, beforeEach, it, vi, expect } from "vitest";

const todo = () => {
  throw new Error(`not implemented`);
};

describe("OperationUseCase", () => {
  const operationClient: OperationClient = {
    execBackgroundOp: todo,
  };
  const sut = new OperationUseCase(operationClient);

  const mockExecBackgroundOp = vi.spyOn(operationClient, "execBackgroundOp");

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
