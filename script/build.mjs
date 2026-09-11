import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { build } from "vite";

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
  const dev = process.env.NODE_ENV === "development";
  await build({
    root: ROOT_DIR,
    configFile: false,
    logLevel: "warn",
    publicDir: false,
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? ""),
      "process.env.BROWSER": JSON.stringify(browser),
    },
    build: {
      target: targets[browser],
      sourcemap: "inline",
      minify: !dev,
      reportCompressedSize: false,
      outDir: `dist/${browser}/lib`,
      emptyOutDir: false,
      lib: {
        // A fixed, unhashed output filename is required: the manifests and
        // console/options HTML reference "<entry>.js"/"<entry>.css" by exact
        // name, and Chrome MV3's background.service_worker/content_scripts
        // must be a single self-contained, non-ESM file.
        entry: path.resolve(ROOT_DIR, entryPoints[entry]),
        formats: ["iife"],
        name: `Vimmatic${entry[0].toUpperCase()}${entry.slice(1)}`,
        fileName: () => `${entry}.js`,
      },
      rollupOptions: {
        output: {
          assetFileNames: `${entry}.css`,
          // Rolldown's own minifier (not esbuild's `keepNames`) mangles
          // function/class names by default; several repositories key
          // caches off `SomeClassImpl.name`, so names must be preserved.
          minify: dev
            ? undefined
            : {
                compress: { keepNames: { function: true, class: true } },
                mangle: { keepNames: { function: true, class: true } },
              },
        },
      },
    },
  });
};

const buildScripts = async (browser) => {
  // Each entry is built in its own child process to keep every entry's
  // build environment (Vite config, plugin state) fully isolated from the
  // others.
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
