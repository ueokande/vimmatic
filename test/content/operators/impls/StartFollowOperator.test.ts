import StartFollowOperator from "../../../../src/content/operators/impls/StartFollowOperator";
import MockFollowMasterClient from "../../mock/MockFollowMasterClient";

describe("StartFollowOperator", () => {
  describe("#run", () => {
    it("starts following links", async () => {
      const client = new MockFollowMasterClient();
      const startFollowSpy = jest
        .spyOn(client, "startFollow")
        .mockReturnValue();
      const sut = new StartFollowOperator(client);

      await sut.run({ newTab: true, background: false });

      expect(startFollowSpy).toBeCalledWith(true, false);
    });
  });
});
