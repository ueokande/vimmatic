import React from "react";
const useCursor = (itemCount: number, initCursor = -1) => {
  if (itemCount < 0) {
    throw new TypeError("item count must be greater than or equal to 0");
  }

  const [select, setSelect] = React.useState(initCursor);
  const next = React.useCallback(() => {
    setSelect((prevSelect) => {
      if (itemCount === 0) {
        return -1;
      }
      if (prevSelect < 0) {
        return 0;
      }
      if (prevSelect + 1 < itemCount) {
        return prevSelect + 1;
      }
      return -1;
    });
  }, [itemCount]);
  const prev = React.useCallback(() => {
    setSelect((prevSelect) => {
      if (itemCount === 0) {
        return -1;
      }
      if (prevSelect < 0) {
        return itemCount - 1;
      }
      return prevSelect - 1;
    });
  }, [itemCount]);
  const reset = React.useCallback(() => {
    setSelect(-1);
  }, []);

  return {
    select,
    next,
    prev,
    reset,
  };
};

export default useCursor;
