import { CommandRegistoryImpl } from "../../../src/background/command/CommandRegistory";

const exec = () => {
  throw new Error("not implemented");
};
const description = () => "";

describe("CommandRegistoryImpl", () => {
  test("register and get command", () => {
    const cmd1 = {
      fullname: () => "open",
      names: () => ["o", "open"],
      description,
      exec,
    };
    const cmd2 = {
      fullname: () => "tabopen",
      names: () => ["t", "tabopen"],
      description,
      exec,
    };

    const r = new CommandRegistoryImpl();
    r.register(cmd1);
    r.register(cmd2);

    let got = r.getCommand("o");
    expect(got.fullname()).toBe("open");
    got = r.getCommand("tabopen");
    expect(got.fullname()).toBe("tabopen");
    got = r.getCommand("unknown");
    expect(got).toBeUndefined();
  });

  test("throws an error when command exists", () => {
    const cmd = {
      fullname: () => "open",
      names: () => ["o", "open"],
      description,
      exec,
    };

    const r = new CommandRegistoryImpl();
    r.register(cmd);

    expect(() =>
      r.register({
        fullname: () => "orient",
        names: () => ["o", "orient"],
        description,
        exec,
      })
    ).toThrowError();
  });

  test("throws an error when names does not contains fullname", () => {
    const r = new CommandRegistoryImpl();
    expect(() =>
      r.register({
        fullname: () => "open",
        names: () => ["o"],
        description,
        exec,
      })
    ).toThrowError();
  });
});
