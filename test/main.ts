import "@abraham/reflection";

const todo = () => {
  throw new Error("not implemented");
};

global.chrome = {
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
      onChanged: {
        addListener: todo,
      },
    },
  },
} as unknown as typeof chrome;
