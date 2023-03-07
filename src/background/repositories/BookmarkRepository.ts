import { injectable } from "inversify";

@injectable()
export default class BookmarkRepository {
  async create(
    title: string,
    url: string
  ): Promise<chrome.bookmarks.BookmarkTreeNode> {
    const item = await chrome.bookmarks.create({ title, url });
    return item;
  }
}
