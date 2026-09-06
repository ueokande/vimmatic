import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { build } from "esbuild";
import stylex from "@stylexjs/unplugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const targets = {
  firefox: "firefox91",
  chrome: "chrome100",
};

const entryPoints = {
  console: "src/console/index.tsx",
  content: "src/content/index.ts",
  background: "src/background/index.ts",
  options: "src/options/index.tsx",
};

const buildEntry = async (browser, entry) => {
  await build({
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? ""),
      "process.env.BROWSER": JSON.stringify(browser),
    },
    entryPoints: [entryPoints[entry]],
    outfile: `./dist/${browser}/lib/${entry}.js`,
    bundle: true,
    metafile: true,
    target: targets[browser],
    sourcemap: "inline",
    keepNames: true,
    minify: process.env.NODE_ENV !== "development",
    platform: "browser",
    plugins: [
      stylex.esbuild({
        dev: false,
        importSources: ["@stylexjs/stylex"],
        unstable_moduleResolution: {
          type: "commonJS",
          rootDir: ROOT_DIR,
        },
      }),
    ],
  });
};

const buildScripts = async (browser) => {
  // Each entry is built in its own child process rather than in-process,
  // because @stylexjs/unplugin tracks collected StyleX rules in a
  // process-global store. Running multiple build() calls in the same
  // process let rules leak across entries and produced a stray
  // "stylex.css" file for entries that don't use StyleX at all.
  for (const entry of Object.keys(entryPoints)) {
    execFileSync(
      process.execPath,
      [__filename, "--build-entry", browser, entry],
      { stdio: "inherit" },
    );
  }
};

const buildAssets = async (browser) => {
  await fs.cp("resources/", `dist/${browser}/resources/`, { recursive: true });
  await fs.copyFile(
    `src/console/index.html`,
    `dist/${browser}/lib/console.html`,
  );
  await fs.copyFile(
    `src/options/index.html`,
    `dist/${browser}/lib/options.html`,
  );
  await fs.copyFile(
    `node_modules/prismjs/themes/prism-coy.css`,
    `dist/${browser}/lib/prism-coy.css`,
  );

  const manifest = JSON.parse(
    await fs.readFile(`src/manifest.${browser}.json`, "utf-8"),
  );
  const packageJson = JSON.parse(await fs.readFile(`package.json`, "utf-8"));
  manifest.version = packageJson.version;
  fs.writeFile(`dist/${browser}/manifest.json`, JSON.stringify(manifest));
};

(async () => {
  if (process.argv[2] === "--build-entry") {
    const [, , , browser, entry] = process.argv;
    await buildEntry(browser, entry);
    return;
  }

  for (const browser of ["firefox", "chrome"]) {
    await buildScripts(browser);
    await buildAssets(browser);
  }
})();
