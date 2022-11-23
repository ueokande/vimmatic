import type { z } from "zod";
import RequestContext from "../infrastructures/RequestContext";

type PropsSchema = ReturnType<typeof z.object>;

export type Props = Record<string, string | number | boolean>;

interface Operator {
  name(): string;

  schema(): PropsSchema | void;

  run(ctx: RequestContext, props: Props): Promise<void>;
}

export default Operator;
