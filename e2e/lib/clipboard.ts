import { spawn } from "node:child_process";

const run = (
  command: string,
  args: string[],
  input?: string,
): Promise<string> =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, { timeout: 5_000 });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (data) => {
      stdout += data;
    });
    child.stderr.on("data", (data) => {
      stderr += data;
    });
    child.on("error", reject);
    child.stdin.on("error", reject);
    child.on("close", (code, signal) => {
      if (code !== 0) {
        reject(new Error(`${command} failed (${signal ?? code}): ${stderr}`));
      } else {
        resolve(stdout);
      }
    });
    child.stdin.end(input);
  });

const read = (): Promise<string> => {
  switch (process.platform) {
    case "linux":
      return run("xsel", ["--clipboard", "--output"]);
    case "darwin":
      return run("pbpaste", []);
    default:
      throw new Error(`Unsupported platform: ${process.platform}`);
  }
};

const write = async (data: string): Promise<void> => {
  switch (process.platform) {
    case "linux":
      await run("xsel", ["--clipboard", "--input"], data);
      break;
    case "darwin":
      await run("pbcopy", [], data);
      break;
    default:
      throw new Error(`Unsupported platform: ${process.platform}`);
  }
};

export { read, write };
