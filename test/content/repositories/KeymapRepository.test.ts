import { KeymapRepositoryImpl } from "../../../src/content/repositories/KeymapRepository";
import { fromKeymap } from "../../../src/shared/key";

describe("KeymapRepositoryImpl", () => {
  let sut: KeymapRepositoryImpl;

  beforeEach(() => {
    sut = new KeymapRepositoryImpl();
  });

  describe("#enqueueKey()", () => {
    it("enqueues keys", () => {
      sut.enqueueKey(fromKeymap("a"));
      sut.enqueueKey(fromKeymap("b"));
      const sequence = sut.enqueueKey(fromKeymap("c"));

      const keys = sequence.keys;
      expect(keys[0].equals(fromKeymap("a"))).toBeTruthy;
      expect(keys[1].equals(fromKeymap("b"))).toBeTruthy;
      expect(keys[2].equals(fromKeymap("c"))).toBeTruthy;
    });
  });

  describe("#clear()", () => {
    it("clears keys", () => {
      sut.enqueueKey(fromKeymap("a"));
      sut.enqueueKey(fromKeymap("b"));
      sut.enqueueKey(fromKeymap("c"));
      sut.clear();

      const sequence = sut.enqueueKey(fromKeymap("a"));
      expect(sequence.length()).toEqual(1);
    });
  });
});
