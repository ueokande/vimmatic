export type Props = Record<string, string | number | boolean>;
export type Operation = { type: string } & Props;

export const extractOperation = (
  op: Operation
): { name: string; props: Props } => {
  const obj: Omit<Operation, "type"> = { ...op };
  delete obj.type;
  return { name: op.type, props: obj };
};
