import { defineConfig } from "vitest/config";

// eslint-disable-next-line no-restricted-exports
export default defineConfig({
  test: {
    include: ["./test/**/*.test.ts", "./test/**/*.test.tsx"],
    setupFiles: "./test/main.ts",
  },
});
