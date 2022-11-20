import Operator from "../Operator";

export default class ReloadTabOperator implements Operator {
  constructor(private readonly cache: boolean) {}

  async run(): Promise<void> {
    await browser.tabs.reload({ bypassCache: this.cache });
  }
}
