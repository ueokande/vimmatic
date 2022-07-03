import { injectable } from "inversify";
import Mark from "../domains/Mark";

export default interface MarkRepository {
  set(key: string, mark: Mark): void;

  get(key: string): Mark | null;
}

const saved: { [key: string]: Mark } = {};

@injectable()
export class MarkRepositoryImpl implements MarkRepository {
  set(key: string, mark: Mark): void {
    saved[key] = mark;
  }

  get(key: string): Mark | null {
    const v = saved[key];
    if (!v) {
      return null;
    }
    return { ...v };
  }
}
