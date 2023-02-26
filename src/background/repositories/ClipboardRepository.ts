import { injectable } from "inversify";

export default interface ClipboardRepository {
  read(): Promise<string>;

  write(value: string): Promise<void>;
}

@injectable()
export class ClipboardRepositoryImpl implements ClipboardRepository {
  async read(): Promise<string> {
    const value = await navigator.clipboard.readText();
    return value;
  }

  async write(value: string): Promise<void> {
    await navigator.clipboard.writeText(value);
  }
}
