import { injectable, inject } from "inversify";
import FollowMasterUseCase from "../usecases/FollowMasterUseCase";
import WindowRequestContext from "./WindowRequestContext";

@injectable()
export default class FollowMasterController {
  constructor(
    @inject(FollowMasterUseCase)
    private readonly followMasterUseCase: FollowMasterUseCase
  ) {}

  followStart(
    _ctx: WindowRequestContext,
    { newTab, background }: { newTab: boolean; background: boolean }
  ): void {
    this.followMasterUseCase.startFollow(newTab, background);
  }

  responseCountTargets(
    ctx: WindowRequestContext,
    { count }: { count: number }
  ): void {
    this.followMasterUseCase.createSlaveHints(count, ctx.sender);
  }

  keyPress(
    _ctx: WindowRequestContext,
    { key, ctrlKey }: { key: string; ctrlKey: boolean }
  ): void {
    if (key === "[" && ctrlKey) {
      this.followMasterUseCase.cancelFollow();
    } else {
      this.followMasterUseCase.enqueue(key);
    }
  }
}
