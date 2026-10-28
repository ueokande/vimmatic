import type { Route } from "../lib/servers";
import { routes as addon } from "./addon_enabled";
import { routes as editor } from "./editor";
import { routes as follow } from "./follow";
import { routes as navigation } from "./navigate";
import { htmlFile } from "./pages";

const pageRoutes = (file: string): Route[] => [
  { url: "/*", handler: htmlFile(file) },
];

const profiles = {
  addon,
  editor,
  follow,
  navigation,
  empty: pageRoutes("empty.html"),
  scrollable: pageRoutes("scrollable.html"),
  find: pageRoutes("find.html"),
  hints: pageRoutes("hint-links.html"),
};

export type SiteProfile = keyof typeof profiles;

export const routesFor = (profile: SiteProfile): Route[] => profiles[profile];
