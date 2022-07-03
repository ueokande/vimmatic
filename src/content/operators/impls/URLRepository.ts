import { injectable } from "inversify";

export default interface URLRepository {
  getCurrentURL(): string;
}

@injectable()
export class URLRepositoryImpl implements URLRepository {
  getCurrentURL(): string {
    return window.location.href;
  }
}
