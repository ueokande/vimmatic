import { CommandRegistryImpl } from "../../../src/background/command/CommandRegistry";

const exec = () => {
  throw new Error("not implemented");
};
const description = () => "";
const getCompletions = () => Promise.resolve([]);

describe("CommandRegistryImpl", () => {
  test("register and get command", () => {
    const cmd1 = {
      fullname: () => "open",
      names: () => ["o", "open"],
      description,
      exec,
      getCompletions,
    };
    const cmd2 = {
      fullname: () => "tabopen",
      names: () => ["t", "tabopen"],
      description,
      exec,
      getCompletions,
    };

    const r = new CommandRegistryImpl();
    r.register(cmd1);
    r.register(cmd2);

    expect(r.getCommand("o")?.fullname()).toBe("open");
    expect(r.getCommand("tabopen")?.fullname()).toBe("tabopen");
    expect(r.getCommand("unknown")).toBeUndefined();
  });

  test("throws an error when command exists", () => {
    const cmd = {
      fullname: () => "open",
      names: () => ["o", "open"],
      description,
      exec,
      getCompletions,
    };

    const r = new CommandRegistryImpl();
    r.register(cmd);

    expect(() =>
      r.register({
        fullname: () => "orient",
        names: () => ["o", "orient"],
        description,
        exec,
        getCompletions,
      }),
    ).toThrow();
  });

  test("throws an error when names does not contains fullname", () => {
    const r = new CommandRegistryImpl();
    expect(() =>
      r.register({
        fullname: () => "open",
        names: () => ["o"],
        description,
        exec,
        getCompletions,
      }),
    ).toThrow();
  });
});
