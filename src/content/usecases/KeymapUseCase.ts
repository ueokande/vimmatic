import { injectable, inject } from "inversify";
import KeymapRepository from "../repositories/KeymapRepository";
import SettingRepository from "../repositories/SettingRepository";
import AddonEnabledRepository from "../repositories/AddonEnabledRepository";
import Keymaps from "../../shared/Keymaps";
import Key from "../../shared/Key";
import KeySequence from "../domains/KeySequence";
import Operation from "../../shared/Operation";
import AddressRepository from "../repositories/AddressRepository";

const reservedKeymaps = new Keymaps({
  "<Esc>": { type: "cancel", props: {} },
  "<C-[>": { type: "cancel", props: {} },
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
  nextOps(key: Key): { repeat: number; op: Operation } | null {
    const sequence = this.repository.enqueueKey(key);
    const baseSequence = sequence.trimNumericPrefix();
    const keymaps = this.keymapEntityMap();
    const matched = keymaps.filter(({ seq }) => seq.startsWith(sequence));
    const baseMatched = keymaps.filter(({ seq }) =>
      seq.startsWith(baseSequence),
    );

    if (baseSequence.length() === 1 && this.blacklistKey(key)) {
      // ignore if the input starts with black list keys
      this.repository.clear();
      return null;
    }

    if (matched.length === 1 && sequence.length() === matched[0].seq.length()) {
      // keys are matched with an operation
      this.repository.clear();
      return { repeat: 1, op: matched[0].op };
    } else if (
      baseMatched.length === 1 &&
      baseSequence.length() === baseMatched[0].seq.length()
    ) {
      // keys are matched with an operation with a numeric prefix
      this.repository.clear();
      return { repeat: sequence.repeatCount(), op: baseMatched[0].op };
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

  private keymapEntityMap(): Array<{ seq: KeySequence; op: Operation }> {
    const keymaps = this.settingRepository
      .getKeymaps()
      .combine(reservedKeymaps);
    let entries: Array<{ seq: KeySequence; op: Operation }> = keymaps
      .entries()
      .map(([keys, op]) => ({ seq: KeySequence.fromMapKeys(keys), op }));
    if (!this.addonEnabledRepository.isEnabled()) {
      // available keymaps are only "addon.enable" and "addon.toggle.enabled" if
      // the addon disabled
      entries = entries.filter(({ op }) => enableAddonOps.includes(op.type));
    }
    return entries;
  }

  private blacklistKey(key: Key): boolean {
    const url = this.addressRepository.getCurrentURL();
    const blacklist = this.settingRepository.getBlacklist();
    return blacklist.includeKey(url, key);
  }
}
