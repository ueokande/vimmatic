import { injectable } from "inversify";

export default interface ClipboardRepository {
  read(): Promise<string>;

  write(value: string): Promise<void>;
}

@injectable()
export class FirefoxClipboardRepositoryImpl implements ClipboardRepository {
  async read(): Promise<string> {
    const value = await navigator.clipboard.readText();
    return value;
  }

  async write(value: string): Promise<void> {
    await navigator.clipboard.writeText(value);
  }
}

@injectable()
export class ChromeClipboardRepositoryImpl implements ClipboardRepository {
  async read(): Promise<string> {
    throw new Error("Chrome does not support clipboard access");
  }

  async write(_value: string): Promise<void> {
    throw new Error("Chrome does not support clipboard access");
  }
}
