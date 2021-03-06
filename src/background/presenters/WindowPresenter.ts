import { injectable } from "inversify";

export default interface WindowPresenter {
  create(url: string): Promise<void>;
}

@injectable()
export class WindowPresenterImpl implements WindowPresenter {
  async create(url: string): Promise<void> {
    await browser.windows.create({ url });
  }
}
