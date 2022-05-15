export type Tab = {
  id: number;
  index: number;
  active: boolean;
  title: string;
  url: string;
  faviconUrl?: string;
};

export default interface TabRepository {
  queryTabs(query: string, excludePinned: boolean): Promise<Tab[]>;

  getAllTabs(excludePinned: boolean): Promise<Tab[]>;
}
