import "@abraham/reflection";

const todo = () => {
  throw new Error("not implemented");
};

global.browser = {
  tabs: {
    query: todo,
    create: todo,
    update: todo,
    remove: todo,
    duplicate: todo,
    reload: todo,
    getZoom: todo,
    setZoom: todo,
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
} as unknown as typeof browser;
