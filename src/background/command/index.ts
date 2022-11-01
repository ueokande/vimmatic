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
import BufferCommandHelper from "./BufferCommandHelper";
import PropertySettings, {
  PropertySettingsImpl,
} from "../settings/PropertySettings";
import SearchEngineSettings, {
  SearchEngineSettingsImpl,
} from "../settings/SearchEngineSettings";
import CommandRegistry, { CommandRegistryImpl } from "./CommandRegistry";
import LastSelectedTab, { LastSelectedTabImpl } from "./LastSelectedTab";
import CachedSettingRepository from "../repositories/CachedSettingRepository";
import ContentMessageClient from "../infrastructures/ContentMessageClient";
import ConsoleClient from "../infrastructures/ConsoleClient";

@injectable()
export class CommandRegistryFactory {
  private readonly lastSelectedTab: LastSelectedTab = new LastSelectedTabImpl();

  private readonly propertySettings: PropertySettings;

  private readonly searchEngineSettings: SearchEngineSettings;

  private readonly bufferCommandHelper: BufferCommandHelper;

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
    this.bufferCommandHelper = new BufferCommandHelper(this.lastSelectedTab);
  }

  create(): CommandRegistry {
    const registory = new CommandRegistryImpl();

    registory.register(new AddBookmarkCommand(this.consoleClient));
    registory.register(
      new BufferCommand(this.lastSelectedTab, this.bufferCommandHelper)
    );
    registory.register(new BufferDeleteCommand(this.bufferCommandHelper));
    registory.register(new BufferDeletesCommand(this.bufferCommandHelper));
    registory.register(new HelpCommand());
    registory.register(
      new OpenCommand(this.searchEngineSettings, this.propertySettings)
    );
    registory.register(
      new TabOpenCommand(this.searchEngineSettings, this.propertySettings)
    );
    registory.register(
      new WindowOpenCommand(this.searchEngineSettings, this.propertySettings)
    );
    registory.register(new QuitAllCommand());
    registory.register(new QuitCommand());
    registory.register(new SetCommand(this.propertySettings));

    return registory;
  }
}
