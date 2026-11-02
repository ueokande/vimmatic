export const requiredId = (value: number | undefined): number => {
  if (value === undefined)
    throw new Error("Browser did not return a tab or window ID");
  return value;
};
