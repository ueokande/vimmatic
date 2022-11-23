import OperationClient from "../../../src/content/client/OperationClient";

export default class MockOperationClient implements OperationClient {
  execBackgroundOp(): Promise<void> {
    throw new Error("not implemented");
  }

  internalOpenUrl(): Promise<void> {
    throw new Error("not implemented");
  }
}
