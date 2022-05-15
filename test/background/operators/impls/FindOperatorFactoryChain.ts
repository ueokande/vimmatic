import "reflect-metadata";
import TabOperatorFactoryChain from "../../../../src/background/operators/impls/TabOperatorFactoryChain";
import MockTabPresenter from "../../mock/MockTabPresenter";
import * as operations from "../../../../src/shared/operations";
import FindNextOperator from "../../../../src/background/operators/impls/FindNextOperator";
import FindPrevOperator from "../../../../src/background/operators/impls/FindPrevOperator";

describe("FindOperatorFactoryChain", () => {
  describe("#create", () => {
    it("returns a operator for the operation", async () => {
      const tabPresenter = new MockTabPresenter();
      const sut = new TabOperatorFactoryChain(tabPresenter);

      expect(sut.create({ type: operations.FIND_NEXT })).toBeInstanceOf(
        FindNextOperator
      );
      expect(sut.create({ type: operations.FIND_PREV })).toBeInstanceOf(
        FindPrevOperator
      );
    });
  });
});
