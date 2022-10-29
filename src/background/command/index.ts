import { injectable, inject } from "inversify";
import AddBookmarkCommand from "./AddBookmarkCommand";
import BufferCommand from "./BufferCommand";
import BufferDeleteCommand from "./BufferDeleteCommand";
import BufferDeletesCommand from "./BufferDeletesCommand";
import HelpCommand from "./HelpCommand";
import OpenCommand from "./OpenCommand";
import QuitAllCommand from "./QuitAllCommand";
import QuitCommand from "./QuitCommand";
import SetCommand from "./SetCommand";
import TabOpenCommand from "./TabOpenCommand";
import WindowOpenCommand from "./WindowOpenCommand";
import TabFilter, { TabFilterImpl } from "./TabFilter";
import PropertySettings, {
  PropertySettingsImpl,
} from "../settings/PropertySettings";
import SearchEngineSettings, {
  SearchEngineSettingsImpl,
} from "../settings/SearchEngineSettings";
import CommandRegistory, { CommandRegistoryImpl } from "./CommandRegistory";
import LastselectedTab, { LastSelectedTabImpl } from "./LastSelectedTab";
import CachedSettingRepository from "../repositories/CachedSettingRepository";
import ContentMessageClient from "../infrastructures/ContentMessageClient";
import ConsoleClient from "../infrastructures/ConsoleClient";

@injectable()
export class CommandRegistoryFactory {
  private readonly tabFilter: TabFilter = new TabFilterImpl();

  private readonly lastSelectedTab: LastselectedTab = new LastSelectedTabImpl();

  private readonly propertySettings: PropertySettings;

  private readonly searchEngineSettings: SearchEngineSettings;

  constructor(
    @inject("CachedSettingRepository")
    cachedSettingRepository: CachedSettingRepository,
    @inject(ContentMessageClient)
    contentMessageClient: ContentMessageClient,
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient
  ) {
    this.propertySettings = new PropertySettingsImpl(
      cachedSettingRepository,
      contentMessageClient
    );
    this.searchEngineSettings = new SearchEngineSettingsImpl(
      cachedSettingRepository
    );
  }

  create(): CommandRegistory {
    const registory = new CommandRegistoryImpl();

    registory.register(new AddBookmarkCommand(this.consoleClient));
    registory.register(new BufferCommand(this.tabFilter, this.lastSelectedTab));
    registory.register(new BufferDeleteCommand(this.tabFilter));
    registory.register(new BufferDeletesCommand(this.tabFilter));
    registory.register(new HelpCommand());
    registory.register(new OpenCommand(this.searchEngineSettings));
    registory.register(new TabOpenCommand(this.searchEngineSettings));
    registory.register(new WindowOpenCommand(this.searchEngineSettings));
    registory.register(new QuitAllCommand());
    registory.register(new QuitCommand());
    registory.register(new SetCommand(this.propertySettings));

    return registory;
  }
}
