import { defineConfig } from "vitest/config";

// eslint-disable-next-line no-restricted-exports
export default defineConfig({
  test: {
    include: ["./test/**/*.test.ts"],
    setupFiles: "./test/main.ts",
  },
});
