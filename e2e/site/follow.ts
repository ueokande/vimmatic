import type { Route } from "../lib/servers";
import { htmlFile } from "./pages";

export const routes: Route[] = [
  {
    url: "/",
    handler: htmlFile("link.html"),
  },
  {
    url: "/follow-input",
    handler: htmlFile("input.html"),
  },
  {
    url: "/area",
    handler: htmlFile("image-map.html"),
  },
  {
    /*
     * test case: link2 is out of the viewport
     * +-----------------+
     * |   [link1]       |<--- window
     * |                 |
     * |=================|<--- viewport
     * |   [link2]       |
     * |                 |
     * +-----------------+
     */
    url: "/test1",
    handler: htmlFile("viewport-links.html"),
  },
  {
    /*
     * test case 2: link2 and link3 are out of window of the frame
     * +-----------------+
     * | +-----------+   |
     * | | [link1]   |   |
     * |=================|
     * | | [link2]   |   |
     * | +-----------+   |
     * |                 |
     * +-----------------+
     */
    url: "/test2",
    handler: htmlFile("tall-frame.html"),
  },
  {
    url: "/test2-frame",
    handler: htmlFile("frame-links.html"),
  },
  {
    /* test case 3: link2 is out of window of the frame
     * +-----------------+
     * | +-----------+   |
     * | | [link1]   |   |
     * | +-----------+   |
     * | : [link2]   :   |
     * | + - - - - - +   |
     * |                 |
     * +-----------------+
     */
    url: "/test3",
    handler: htmlFile("short-frame.html"),
  },
  {
    url: "/test3-frame",
    handler: htmlFile("frame-links.html"),
  },
  { url: "/hello", handler: htmlFile("empty.html") },
];
