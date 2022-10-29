import { parseCommand } from "../../../src/background/controllers/parser";

type TestCase = {
  input: string;
  result: ReturnType<parseCommand>;
};

const cases: TestCase[] = [
  {
    input: "",
    result: { name: "", force: false, args: "" },
  },
  {
    input: "open google.com",
    result: { name: "open", force: false, args: "google.com" },
  },
  {
    input: "  open   google.com    ",
    result: { name: "open", force: false, args: "google.com" },
  },
  {
    input: "quit!",
    result: { name: "quit", force: true, args: "" },
  },
  {
    input: "bdeletes! hoge fuga piyo",
    result: { name: "bdeletes", force: true, args: "hoge fuga piyo" },
  },
  {
    input: "!",
    result: { name: "!", force: false, args: "" },
  },
];

test.each(cases)('parse "$input"', ({ input, result }) => {
  const ret = parseCommand(input);

  expect(ret).toEqual(result);
});
