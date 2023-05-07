import type Key from "../../../src/shared/Key";

export default interface SiteHack {
  match(): boolean;

  fromInput(e: Element): boolean;

  reservedKeys(): Key[];
}
