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
} as unknown as typeof browser;
