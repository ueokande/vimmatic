import "@abraham/reflection";
import inject from "@stylexjs/dev-runtime";
import { vi, beforeAll, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

beforeAll(() => {
  vi.mock("@stylexjs/stylex", () => {
    const stylex = inject({
      dev: true,
      test: true,
    } as any);

    return stylex;
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const todo = () => {
  throw new Error("not implemented");
};

global.chrome = {
  runtime: {
    sendMessage: todo,
  },
  tabs: {
    query: todo,
    create: todo,
    update: todo,
    remove: todo,
    duplicate: todo,
    reload: todo,
    getZoom: todo,
    setZoom: todo,
    onActivated: {
      addListener: todo,
    },
  },
  history: {
    search: todo,
  },
  bookmarks: {
    get: todo,
    getChildren: todo,
    getRecent: todo,
    create: todo,
    search: todo,
  },
  windows: {
    getCurrent: todo,
  },
  sessions: {
    getRecentlyClosed: todo,
    restore: todo,
  },
  browserSettings: {
    homepageOverride: {
      get: todo,
    },
  },
  storage: {
    sync: {
      get: todo,
      set: todo,
      onChanged: {
        addListener: todo,
      },
    },
  },
} as unknown as typeof chrome;

if (global.Element) {
  global.Element.prototype.checkVisibility = () => true;
}
if (global.Document) {
  global.Document.prototype.elementFromPoint = () => null;
}
