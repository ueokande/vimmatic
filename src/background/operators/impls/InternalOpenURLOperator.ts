import Operator from "../Operator";

export default class InternalOpenURLOperator implements Operator {
  constructor(
    private readonly url: string,
    private readonly newTab?: boolean,
    private readonly newWindow?: boolean
  ) {}

  async run(): Promise<void> {
    if (this.newWindow) {
      await browser.windows.create({ url: this.url });
    } else if (this.newTab) {
      await browser.tabs.create({ url: this.url });
    } else {
      await browser.tabs.update({ url: this.url });
    }
  }
}
