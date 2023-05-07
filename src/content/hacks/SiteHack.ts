export default interface SiteHack {
  match(): boolean;

  fromInput(e: Element): boolean;
}
