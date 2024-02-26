import { inject, injectable } from "inversify";
import type { OperatorRegistory } from "./OperatorRegistory";
import EnableAddonOperator from "./impls/EnableAddonOperator";
import DisableAddonOperator from "./impls/DisableAddonOperator";
import ToggleAddonOperator from "./impls/ToggleAddonOperator";
import CancelOperator from "./impls/CancelOperator";
import CloseTabOperator from "./impls/CloseTabOperator";
import CloseTabRightOperator from "./impls/CloseTabRightOperator";
import DuplicateTabOperator from "./impls/DuplicateTabOperator";
import FindNextOperator from "./impls/FindNextOperator";
import FindPrevOperator from "./impls/FindPrevOperator";
import NavigateHistoryNextOperator from "./impls/NavigateHistoryNextOperator";
import NavigateHistoryPrevOperator from "./impls/NavigateHistoryPrevOperator";
import NavigateLinkNextOperator from "./impls/NavigateLinkNextOperator";
import NavigateLinkPrevOperator from "./impls/NavigateLinkPrevOperator";
import NavigateParentOperator from "./impls/NavigateParentOperator";
import NavigateRootOperator from "./impls/NavigateRootOperator";
import OpenHomeOperator from "./impls/OpenHomeOperator";
import OpenSourceOperator from "./impls/OpenSourceOperator";
import PinTabOperator from "./impls/PinTabOperator";
import ReloadTabOperator from "./impls/ReloadTabOperator";
import ReopenTabOperator from "./impls/ReopenTabOperator";
import RepeatLastOperator from "./impls/RepeatLastOperator";
import SelectFirstTabOperator from "./impls/SelectFirstTabOperator";
import SelectLastTabOperator from "./impls/SelectLastTabOperator";
import SelectPreviousSelectedTabOperator from "./impls/SelectPreviousSelectedTabOperator";
import SelectTabNextOperator from "./impls/SelectTabNextOperator";
import SelectTabPrevOperator from "./impls/SelectTabPrevOperator";
import ShowAddBookmarkOperator from "./impls/ShowAddBookmarkOperator";
import ShowBufferCommandOperator from "./impls/ShowBufferCommandOperator";
import ShowCommandOperator from "./impls/ShowCommandOperator";
import ShowOpenCommandOperator from "./impls/ShowOpenCommandOperator";
import ShowTabOpenCommandOperator from "./impls/ShowTabOpenCommandOperator";
import ShowWinOpenCommandOperator from "./impls/ShowWinOpenCommandOperator";
import StartFindOperator from "./impls/StartFindOperator";
import TogglePinnedTabOperator from "./impls/TogglePinnedTabOperator";
import ToggleReaderOperator from "./impls/ToggleReaderOperator";
import UnpinTabOperator from "./impls/UnpinTabOperator";
import ZoomInOperator from "./impls/ZoomInOperator";
import ZoomOutOperator from "./impls/ZoomOutOperator";
import ZoomResetOperator from "./impls/ZoomResetOperator";
import HorizontalScrollOperator from "./impls/HorizontalScrollOperator";
import ScrollToBottomOperator from "./impls/ScrollToBottomOperator";
import ScrollToEndOperator from "./impls/ScrollToEndOperator";
import ScrollToHomeOperator from "./impls/ScrollToHomeOperator";
import ScrollToTopOperator from "./impls/ScrollToTopOperator";
import VerticalScrollOperator from "./impls/VerticalScrollOperator";
import PageScrollOperator from "./impls/PageScrollOperator";
import FocusOperator from "./impls/FocusOperator";
import YankOperator from "./impls/YankOperator";
import PasteOperator from "./impls/PasteOperator";
import StartSetMarkOperator from "./impls/StartSetMarkOperator";
import StartJumpMarkOperator from "./impls/StartJumpMarkOperator";
import StartFollowOperator from "./impls/StartFollowOperator";
import QuickHintOperator from "./impls/QuickHintOperator";
import OpenImageHintOperator from "./impls/OpenImageHintOperator";
import YankURLHintOperator from "./impls/YankURLHintOperator";
import YankLinkTextOperator from "./impls/YankLinkTextOperator";
import OpenHintOperator from "./impls/OpenHintOperator";
import TabopenHintOperator from "./impls/TabopenHintOperator";
import WinopenHintOperator from "./impls/WinopenHintOperator";
import OpenCommandHintOperator from "./impls/OpenCommandHintOperator";
import TabopenCommandHintOperator from "./impls/TabopenCommandHintOperator";
import WinopenCommandHintOperator from "./impls/WinopenCommandHintOperator";
import OpenSourceHintOperator from "./impls/OpenSourceHintOperator";
import type { RepeatRepository } from "../repositories/RepeatRepository";
import { OperatorRegistryImpl } from "./OperatorRegistory";

@injectable()
export class OperatorRegistoryFactory {
  constructor(
    @inject(EnableAddonOperator)
    private readonly enableAddonOperator: EnableAddonOperator,
    @inject(DisableAddonOperator)
    private readonly disableAddonOperator: DisableAddonOperator,
    @inject(ToggleAddonOperator)
    private readonly toggleAddonOperator: ToggleAddonOperator,
    @inject(CancelOperator)
    private readonly cancelOperator: CancelOperator,
    @inject(CloseTabOperator)
    private readonly closeTabOperator: CloseTabOperator,
    @inject(CloseTabRightOperator)
    private readonly closeTabRightOperator: CloseTabRightOperator,
    @inject(DuplicateTabOperator)
    private readonly duplicateTabOperator: DuplicateTabOperator,
    @inject(FindNextOperator)
    private readonly findNextOperator: FindNextOperator,
    @inject(FindPrevOperator)
    private readonly findPrevOperator: FindPrevOperator,
    @inject(NavigateHistoryNextOperator)
    private readonly navigateHistoryNextOperator: NavigateHistoryNextOperator,
    @inject(NavigateHistoryPrevOperator)
    private readonly navigateHistoryPrevOperator: NavigateHistoryPrevOperator,
    @inject(NavigateLinkNextOperator)
    private readonly navigateLinkNextOperator: NavigateLinkNextOperator,
    @inject(NavigateLinkPrevOperator)
    private readonly navigateLinkPrevOperator: NavigateLinkPrevOperator,
    @inject(NavigateParentOperator)
    private readonly navigateParentOperator: NavigateParentOperator,
    @inject(NavigateRootOperator)
    private readonly navigateRootOperator: NavigateRootOperator,
    @inject(OpenHomeOperator)
    private readonly openHomeOperator: OpenHomeOperator,
    @inject(OpenSourceOperator)
    private readonly openSourceOperator: OpenSourceOperator,
    @inject(PinTabOperator)
    private readonly pinTabOperator: PinTabOperator,
    @inject(ReloadTabOperator)
    private readonly reloadTabOperator: ReloadTabOperator,
    @inject(ReopenTabOperator)
    private readonly reopenTabOperator: ReopenTabOperator,
    @inject(SelectFirstTabOperator)
    private readonly selectFirstTabOperator: SelectFirstTabOperator,
    @inject(SelectLastTabOperator)
    private readonly selectLastTabOperator: SelectLastTabOperator,
    @inject(SelectPreviousSelectedTabOperator)
    private readonly selectPreviousSelectedTabOperator: SelectPreviousSelectedTabOperator,
    @inject(SelectTabNextOperator)
    private readonly selectTabNextOperator: SelectTabNextOperator,
    @inject(SelectTabPrevOperator)
    private readonly selectTabPrevOperator: SelectTabPrevOperator,
    @inject(ShowAddBookmarkOperator)
    private readonly showAddBookmarkOperator: ShowAddBookmarkOperator,
    @inject(ShowBufferCommandOperator)
    private readonly showBufferCommandOperator: ShowBufferCommandOperator,
    @inject(ShowCommandOperator)
    private readonly showCommandOperator: ShowCommandOperator,
    @inject(ShowOpenCommandOperator)
    private readonly showOpenCommandOperator: ShowOpenCommandOperator,
    @inject(ShowTabOpenCommandOperator)
    private readonly showTabOpenCommandOperator: ShowTabOpenCommandOperator,
    @inject(ShowWinOpenCommandOperator)
    private readonly showWinOpenCommandOperator: ShowWinOpenCommandOperator,
    @inject(StartFindOperator)
    private readonly startFindOperator: StartFindOperator,
    @inject(TogglePinnedTabOperator)
    private readonly togglePinnedTabOperator: TogglePinnedTabOperator,
    @inject(ToggleReaderOperator)
    private readonly toggleReaderOperator: ToggleReaderOperator,
    @inject(UnpinTabOperator)
    private readonly unpinTabOperator: UnpinTabOperator,
    @inject(ZoomInOperator)
    private readonly zoomInOperator: ZoomInOperator,
    @inject(ZoomOutOperator)
    private readonly zoomOutOperator: ZoomOutOperator,
    @inject(ZoomResetOperator)
    private readonly zoomResetOperator: ZoomResetOperator,
    @inject(HorizontalScrollOperator)
    private readonly horizontalScrollOperator: HorizontalScrollOperator,
    @inject(ScrollToBottomOperator)
    private readonly scrollToBottomOperator: ScrollToBottomOperator,
    @inject(ScrollToEndOperator)
    private readonly scrollToEndOperator: ScrollToEndOperator,
    @inject(ScrollToHomeOperator)
    private readonly scrollToHomeOperator: ScrollToHomeOperator,
    @inject(ScrollToTopOperator)
    private readonly scrollToTopOperator: ScrollToTopOperator,
    @inject(VerticalScrollOperator)
    private readonly verticalScrollOperator: VerticalScrollOperator,
    @inject(PageScrollOperator)
    private readonly pageScrollOperator: PageScrollOperator,
    @inject(FocusOperator)
    private readonly focusOperator: FocusOperator,
    @inject(YankOperator)
    private readonly yankOperator: YankOperator,
    @inject(PasteOperator)
    private readonly pasteOperator: PasteOperator,
    @inject(StartSetMarkOperator)
    private readonly startSetMarkOperator: StartSetMarkOperator,
    @inject(StartJumpMarkOperator)
    private readonly startJumpMarkOperator: StartJumpMarkOperator,
    @inject(StartFollowOperator)
    private readonly startFollowOperator: StartFollowOperator,
    @inject(QuickHintOperator)
    private readonly quickHintOperator: QuickHintOperator,
    @inject(OpenImageHintOperator)
    private readonly openImageHintOperator: OpenImageHintOperator,
    @inject(YankURLHintOperator)
    private readonly yankURLHintOperator: YankURLHintOperator,
    @inject(YankLinkTextOperator)
    private readonly yankLinkTextOperator: YankLinkTextOperator,
    @inject(OpenHintOperator)
    private readonly openHintOperator: OpenHintOperator,
    @inject(TabopenHintOperator)
    private readonly tabopenHintOperator: TabopenHintOperator,
    @inject(WinopenHintOperator)
    private readonly winopenHintOperator: WinopenHintOperator,
    @inject(OpenCommandHintOperator)
    private readonly openCommandHintOperator: OpenCommandHintOperator,
    @inject(TabopenCommandHintOperator)
    private readonly tabopenCommandHintOperator: TabopenCommandHintOperator,
    @inject(WinopenCommandHintOperator)
    private readonly winopenCommandHintOperator: WinopenCommandHintOperator,
    @inject(OpenSourceHintOperator)
    private readonly openSourceHintOperator: OpenSourceHintOperator,
    @inject("RepeatRepository")
    private readonly repeatRepository: RepeatRepository,
  ) {}

  create(): OperatorRegistory {
    const r = new OperatorRegistryImpl();
    r.register(this.enableAddonOperator);
    r.register(this.disableAddonOperator);
    r.register(this.toggleAddonOperator);
    r.register(this.cancelOperator);
    r.register(this.closeTabOperator);
    r.register(this.closeTabRightOperator);
    r.register(this.duplicateTabOperator);
    r.register(this.findNextOperator);
    r.register(this.findPrevOperator);
    r.register(this.navigateHistoryNextOperator);
    r.register(this.navigateHistoryPrevOperator);
    r.register(this.navigateLinkNextOperator);
    r.register(this.navigateLinkPrevOperator);
    r.register(this.navigateParentOperator);
    r.register(this.navigateRootOperator);
    r.register(this.openHomeOperator);
    r.register(this.openSourceOperator);
    r.register(this.pinTabOperator);
    r.register(this.reloadTabOperator);
    r.register(this.reopenTabOperator);
    r.register(this.selectFirstTabOperator);
    r.register(this.selectLastTabOperator);
    r.register(this.selectPreviousSelectedTabOperator);
    r.register(this.selectTabNextOperator);
    r.register(this.selectTabPrevOperator);
    r.register(this.showAddBookmarkOperator);
    r.register(this.showBufferCommandOperator);
    r.register(this.showCommandOperator);
    r.register(this.showOpenCommandOperator);
    r.register(this.showTabOpenCommandOperator);
    r.register(this.showWinOpenCommandOperator);
    r.register(this.startFindOperator);
    r.register(this.togglePinnedTabOperator);
    r.register(this.toggleReaderOperator);
    r.register(this.unpinTabOperator);
    r.register(this.zoomInOperator);
    r.register(this.zoomOutOperator);
    r.register(this.zoomResetOperator);

    r.register(this.horizontalScrollOperator);
    r.register(this.scrollToBottomOperator);
    r.register(this.scrollToEndOperator);
    r.register(this.scrollToHomeOperator);
    r.register(this.scrollToTopOperator);
    r.register(this.verticalScrollOperator);
    r.register(this.pageScrollOperator);

    r.register(this.focusOperator);
    r.register(this.yankOperator);
    r.register(this.pasteOperator);
    r.register(this.startSetMarkOperator);
    r.register(this.startJumpMarkOperator);
    r.register(this.startFollowOperator);
    r.register(this.quickHintOperator);
    r.register(this.openImageHintOperator);
    r.register(this.yankURLHintOperator);
    r.register(this.yankLinkTextOperator);
    r.register(this.openHintOperator);
    r.register(this.tabopenHintOperator);
    r.register(this.winopenHintOperator);
    r.register(this.openCommandHintOperator);
    r.register(this.tabopenCommandHintOperator);
    r.register(this.winopenCommandHintOperator);
    r.register(this.openSourceHintOperator);

    // resolve circular dependency
    const repeatLastOperator: RepeatLastOperator = new RepeatLastOperator(
      r,
      this.repeatRepository,
    );

    r.register(repeatLastOperator);
    return r;
  }
}
