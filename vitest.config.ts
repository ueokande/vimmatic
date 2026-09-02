import path from "node:path";
import { defineConfig } from "vitest/config";
import stylex from "@stylexjs/unplugin";

const ROOT_DIR = path.dirname(new URL(import.meta.url).pathname);

// eslint-disable-next-line no-restricted-exports
export default defineConfig({
  plugins: [
    stylex.vite({
      dev: true,
      test: true,
      importSources: ["@stylexjs/stylex"],
      unstable_moduleResolution: {
        type: "commonJS",
        rootDir: ROOT_DIR,
      },
    }),
  ],
  test: {
    include: ["./test/**/*.test.ts", "./test/**/*.test.tsx"],
    setupFiles: "./test/main.ts",
  },
});
