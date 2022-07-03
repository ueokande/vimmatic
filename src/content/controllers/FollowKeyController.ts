import { injectable, inject } from "inversify";
import FollowSlaveUseCase from "../usecases/FollowSlaveUseCase";
import Key from "../../shared/settings/Key";

@injectable()
export default class FollowKeyController {
  constructor(
    @inject(FollowSlaveUseCase)
    private readonly followSlaveUseCase: FollowSlaveUseCase
  ) {}

  press(key: Key): boolean {
    if (!this.followSlaveUseCase.isFollowMode()) {
      return false;
    }

    this.followSlaveUseCase.sendKey(key);
    return true;
  }
}
