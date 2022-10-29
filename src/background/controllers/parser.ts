type Result = {
  name: string;
  force: boolean;
  args: string;
};

export const parseCommand = (input: string): Result => {
  const trimmed = input.trim();
  let name = trimmed.split(" ", 1)[0];
  if (name.length === 0) {
    return { name: "", force: false, args: "" };
  }
  if (name === "!") {
    return { name: "!", force: false, args: "" };
  }
  const args = trimmed.slice(name.length).trim();
  const force = name.endsWith("!");
  if (force) {
    name = name.slice(0, -1);
  }
  return { name, force, args };
};
