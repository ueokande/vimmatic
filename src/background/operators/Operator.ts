import type { z } from "zod";

type PropsSchema = ReturnType<typeof z.object>;

export type Props = Record<string, string | number | boolean>;

interface Operator {
  name(): string;

  schema(): PropsSchema | void;

  run(props: Props): Promise<void>;
}

export default Operator;
