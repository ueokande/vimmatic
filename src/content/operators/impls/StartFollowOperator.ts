import { injectable, inject } from "inversify";
import { z } from "zod";
import Operator from "../Operator";
import FollowMasterClient from "../../client/FollowMasterClient";

@injectable()
export default class StartFollowOperator implements Operator {
  constructor(
    @inject("FollowMasterClient")
    private readonly followMasterClient: FollowMasterClient
  ) {}

  name() {
    return "follow.start";
  }

  schema() {
    return z.object({
      newTab: z.boolean().default(false),
      background: z.boolean().default(false),
    });
  }

  async run({
    newTab,
    background,
  }: z.infer<ReturnType<StartFollowOperator["schema"]>>): Promise<void> {
    this.followMasterClient.startFollow(newTab, background);
  }
}
