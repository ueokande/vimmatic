import HintTagProducer from "../../../src/background/usecases/HintTagProducer";

describe("HintTagProducer", () => {
  it("produce incremental keys", () => {
    const sut = new HintTagProducer("abc");
    expect(sut.produce()).toBe("a");
    expect(sut.produce()).toBe("b");
    expect(sut.produce()).toBe("c");
    expect(sut.produce()).toBe("aa");
    expect(sut.produce()).toBe("ab");
    expect(sut.produce()).toBe("ac");
    expect(sut.produce()).toBe("ba");
    expect(sut.produce()).toBe("bb");
    expect(sut.produce()).toBe("bc");
    expect(sut.produce()).toBe("ca");
    expect(sut.produce()).toBe("cb");
    expect(sut.produce()).toBe("cc");
    expect(sut.produce()).toBe("aaa");
    expect(sut.produce()).toBe("aab");
    expect(sut.produce()).toBe("aac");
    expect(sut.produce()).toBe("aba");
  });

  it("produce certain incremental keys", () => {
    const sut = new HintTagProducer("abc");
    expect(sut.produceN(4)).toEqual(["a", "b", "c", "aa"]);
    expect(sut.produceN(4)).toEqual(["ab", "ac", "ba", "bb"]);
  });
});
