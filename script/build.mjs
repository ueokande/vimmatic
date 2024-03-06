import fs from "node:fs/promises";
import { build } from "esbuild";

const targets = {
  firefox: "firefox91",
  chrome: "chrome100",
};

const buildScripts = async (browser) => {
  await build({
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? ""),
      "process.env.BROWSER": JSON.stringify(browser),
    },
    entryPoints: {
      console: "src/console/index.tsx",
      content: "src/content/index.ts",
      background: "src/background/index.ts",
      options: "src/options/index.tsx",
    },
    outdir: `./dist/${browser}/lib`,
    bundle: true,
    target: targets[browser],
    sourcemap: "inline",
    keepNames: true,
    minify: process.env.NODE_ENV !== "development",
    platform: "browser",
  });
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

  const manifest = JSON.parse(
    await fs.readFile(`src/manifest.${browser}.json`, "utf-8"),
  );
  const packageJson = JSON.parse(await fs.readFile(`package.json`, "utf-8"));
  manifest.version = packageJson.version;
  fs.writeFile(`dist/${browser}/manifest.json`, JSON.stringify(manifest));
};

(async () => {
  for (const browser of ["firefox", "chrome"]) {
    await buildScripts(browser);
    await buildAssets(browser);
  }
})();
