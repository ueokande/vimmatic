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
  bookmarks: {
    get: todo,
    getChildren: todo,
    getRecent: todo,
    create: todo,
  },
} as unknown as typeof browser;
