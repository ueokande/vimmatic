import { injectable } from "inversify";

export default interface FollowKeyRepository {
  getKeys(): string[];

  pushKey(key: string): void;

  popKey(): void;

  clearKeys(): void;
}

const current: {
  keys: string[];
} = {
  keys: [],
};

@injectable()
export class FollowKeyRepositoryImpl implements FollowKeyRepository {
  getKeys(): string[] {
    return current.keys;
  }

  pushKey(key: string): void {
    current.keys.push(key);
  }

  popKey(): void {
    current.keys.pop();
  }

  clearKeys(): void {
    current.keys = [];
  }
}
