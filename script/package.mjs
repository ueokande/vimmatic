import fs from "node:fs";
import path from "node:path";
import JSZip from "jszip";

async function* tree(dir) {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const r = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* tree(r);
    } else {
      yield r;
    }
  }
}

const zipPackage = async (browser) => {
  const packageJson = JSON.parse(
    await fs.promises.readFile("package.json", "utf8"),
  );
  const version = packageJson.version;
  const root = path.join("dist", browser);
  const output = path.join("dist", `vimmatic_v${version}_${browser}.zip`);

  const zip = new JSZip();

  for await (const f of tree(root)) {
    const relative = path.relative(root, f);
    console.error(`  adding: ${relative}`);
    const data = fs.readFileSync(f);
    zip.file(relative, data);
  }

  await new Promise((resolve, reject) => {
    zip
      .generateNodeStream({
        type: "nodebuffer",
        streamFiles: true,
        compression: "DEFLATE",
      })
      .pipe(fs.createWriteStream(output))
      .on("finish", resolve)
      .on("error", reject);
  });
  console.error(`${output} created`);
};

(async () => {
  for (const browser of ["firefox", "chrome"]) {
    await zipPackage(browser);
  }
})();
