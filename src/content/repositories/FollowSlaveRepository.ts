import { injectable } from "inversify";

export default interface FollowSlaveRepository {
  enableFollowMode(): void;

  disableFollowMode(): void;

  isFollowMode(): boolean;
}

const current: {
  enabled: boolean;
} = {
  enabled: false,
};

@injectable()
export class FollowSlaveRepositoryImpl implements FollowSlaveRepository {
  enableFollowMode(): void {
    current.enabled = true;
  }

  disableFollowMode(): void {
    current.enabled = false;
  }

  isFollowMode(): boolean {
    return current.enabled;
  }
}
