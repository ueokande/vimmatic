import { injectable, inject } from "inversify";
import KeymapRepository from "../repositories/KeymapRepository";
import SettingRepository from "../repositories/SettingRepository";
import AddonEnabledRepository from "../repositories/AddonEnabledRepository";
import Keymaps from "../../shared/Keymaps";
import Key from "../../shared/Key";
import { extractOperation, Props, Operation } from "../../shared/operations2";
import KeySequence from "../domains/KeySequence";
import AddressRepository from "../repositories/AddressRepository";

const reservedKeymaps = new Keymaps({
  "<Esc>": { type: "cancel" },
  "<C-[>": { type: "cancel" },
});

const enableAddonOps = ["addon.enable", "addon.toggle.enabled"];

@injectable()
export default class KeymapUseCase {
  constructor(
    @inject("KeymapRepository")
    private readonly repository: KeymapRepository,
    @inject("SettingRepository")
    private readonly settingRepository: SettingRepository,
    @inject("AddonEnabledRepository")
    private readonly addonEnabledRepository: AddonEnabledRepository,
    @inject("AddressRepository")
    private readonly addressRepository: AddressRepository,
  ) {}

  // eslint-disable-next-line max-statements
  nextOps(key: Key): { repeat: number; name: string; props: Props } | null {
    const sequence = this.repository.enqueueKey(key);
    const baseSequence = sequence.trimNumericPrefix();
    const keymaps = this.keymapEntityMap();
    const matched = keymaps.filter(([seq]) => seq.startsWith(sequence));
    const baseMatched = keymaps.filter(([seq]) => seq.startsWith(baseSequence));

    if (baseSequence.length() === 1 && this.blacklistKey(key)) {
      // ignore if the input starts with black list keys
      this.repository.clear();
      return null;
    }

    if (matched.length === 1 && sequence.length() === matched[0][0].length()) {
      // keys are matched with an operation
      this.repository.clear();
      const { name, props } = extractOperation(matched[0][1]);
      return { repeat: 1, name, props };
    } else if (
      baseMatched.length === 1 &&
      baseSequence.length() === baseMatched[0][0].length()
    ) {
      // keys are matched with an operation with a numeric prefix
      this.repository.clear();
      const { name, props } = extractOperation(baseMatched[0][1]);
      return {
        repeat: sequence.repeatCount(),
        name,
        props,
      };
    } else if (matched.length >= 1 || baseMatched.length >= 1) {
      // keys are matched with an operation's prefix
      return null;
    }

    // matched with no operations
    this.repository.clear();
    return null;
  }

  cancel() {
    this.repository.clear();
  }

  private keymapEntityMap(): [KeySequence, Operation][] {
    const keymaps = this.settingRepository
      .getKeymaps()
      .combine(reservedKeymaps);
    let entries = keymaps
      .entries()
      .map(([keys, op]) => [KeySequence.fromMapKeys(keys), op]) as [
      KeySequence,
      Operation,
    ][];
    if (!this.addonEnabledRepository.isEnabled()) {
      // available keymaps are only "addon.enable" and "addon.toggle.enabled" if
      // the addon disabled
      entries = entries.filter(([_seq, { type }]) =>
        enableAddonOps.includes(type),
      );
    }
    return entries;
  }

  private blacklistKey(key: Key): boolean {
    const url = this.addressRepository.getCurrentURL();
    const blacklist = this.settingRepository.getBlacklist();
    return blacklist.includeKey(url, key);
  }
}
