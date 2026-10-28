import { readFileSync } from "node:fs";
import path from "node:path";
import { staticContentHandler } from "../lib/servers";

export const htmlFile = (name: string) =>
  staticContentHandler(
    readFileSync(path.join(__dirname, "pages", name), "utf8"),
  );
