import fs from "node:fs/promises";
import path from "node:path";
import { build } from "esbuild";
import stylexPlugin from "@stylexjs/esbuild-plugin";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const ROOT_DIR = path.resolve(__dirname, "..");

const targets = {
  firefox: "firefox91",
  chrome: "chrome100",
};

const buildScripts = async (browser) => {
  const entryPoints = {
    console: "src/console/index.tsx",
    content: "src/content/index.ts",
    background: "src/background/index.ts",
    options: "src/options/index.tsx",
  };
  for (const entry of ["console", "content", "background", "options"]) {
    await build({
      define: {
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? ""),
        "process.env.BROWSER": JSON.stringify(browser),
      },
      entryPoints: [entryPoints[entry]],
      outfile: `./dist/${browser}/lib/${entry}.js`,
      bundle: true,
      target: targets[browser],
      sourcemap: "inline",
      keepNames: true,
      minify: process.env.NODE_ENV !== "development",
      platform: "browser",
      plugins: [
        stylexPlugin({
          dev: false,
          generatedCSSFileName: path.resolve(
            ROOT_DIR,
            `dist/${browser}/lib/${entry}.css`,
          ),
          stylexImports: ["@stylexjs/stylex"],
          unstable_moduleResolution: {
            type: "commonJS",
            rootDir: ROOT_DIR,
          },
        }),
      ],
    });
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
