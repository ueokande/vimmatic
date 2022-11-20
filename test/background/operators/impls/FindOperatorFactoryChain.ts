import FindOperatorFactoryChain from "../../../../src/background/operators/impls/FindOperatorFactoryChain";
import * as operations from "../../../../src/shared/operations";
import FindNextOperator from "../../../../src/background/operators/impls/FindNextOperator";
import FindPrevOperator from "../../../../src/background/operators/impls/FindPrevOperator";
import MockFindRepository from "../../mock/MockFindRepository";
import MockFindClient from "../../mock/MockFindClient";
import MockConsoleClient from "../../mock/MockConsoleClient";
import MockReadyFrameRepository from "../../mock/MockReadyFrameRepository";

describe("FindOperatorFactoryChain", () => {
  describe("#create", () => {
    it("returns a operator for the operation", async () => {
      const findRepository = new MockFindRepository();
      const findClient = new MockFindClient();
      const consoleClient = new MockConsoleClient();
      const frameRepository = new MockReadyFrameRepository();
      const sut = new FindOperatorFactoryChain(
        findRepository,
        findClient,
        consoleClient,
        frameRepository
      );

      expect(sut.create({ type: operations.FIND_NEXT })).toBeInstanceOf(
        FindNextOperator
      );
      expect(sut.create({ type: operations.FIND_PREV })).toBeInstanceOf(
        FindPrevOperator
      );
    });
  });
});
