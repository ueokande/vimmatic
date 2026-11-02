import type { Route } from "../lib/servers";
import { htmlFile } from "./pages";

export const routes: Route[] = [
  {
    url: "/",
    handler: htmlFile("scrollable.html"),
  },
  {
    url: "/frame",
    handler: htmlFile("framed-scrollable.html"),
  },
];
