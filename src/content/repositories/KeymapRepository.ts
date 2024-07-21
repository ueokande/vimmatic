import { provide } from "inversify-binding-decorators";
import type { Key } from "../../shared/key";
import { KeySequence } from "../domains/KeySequence";

export interface KeymapRepository {
  enqueueKey(key: Key): KeySequence;

  clear(): void;
}

let current: KeySequence = new KeySequence([]);

export const KeymapRepository = Symbol("KeymapRepository");

@provide(KeymapRepository)
export class KeymapRepositoryImpl implements KeymapRepository {
  enqueueKey(key: Key): KeySequence {
    current.push(key);
    return current;
  }

  clear(): void {
    current = new KeySequence([]);
  }
}
