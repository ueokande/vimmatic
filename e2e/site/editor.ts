import type { Route } from "../lib/servers";
import { htmlFile } from "./pages";

export const routes: Route[] = [
  {
    url: "/designmode",
    handler: htmlFile("designmode.html"),
  },
  {
    url: "/contenteditable",
    handler: htmlFile("contenteditable.html"),
  },
  {
    url: "/shadow",
    handler: htmlFile("shadow-input.html"),
  },
];
