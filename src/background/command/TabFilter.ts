export default interface TabFilter {
  getByKeyword(keyword: string): Promise<browser.tabs.Tab[]>;
}

export class TabFilterImpl {
  async getByKeyword(keyword: string): Promise<browser.tabs.Tab[]> {
    const tabs = await browser.tabs.query({ currentWindow: true });
    return tabs.filter((t) => {
      return (
        (t.url && t.url.toLowerCase().includes(keyword.toLowerCase())) ||
        (t.title && t.title.toLowerCase().includes(keyword.toLowerCase()))
      );
    });
  }
}
