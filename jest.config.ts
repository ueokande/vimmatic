import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  testMatch: ["**/test/**/*.test.+(ts|tsx|js|jsx)"],
  transform: {
    "^.+\\.(ts|tsx)$": "esbuild-jest",
  },
  setupFiles: ["./test/main.ts"],
};
export default config;
