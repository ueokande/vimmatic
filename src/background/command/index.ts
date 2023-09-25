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
import PropertyRegistry from "../property/PropertyRegistry";
import PropertySettings from "../settings/PropertySettings";
import SearchEngineSettings from "../settings/SearchEngineSettings";
import CommandRegistry, { CommandRegistryImpl } from "./CommandRegistry";
import LastSelectedTabRepository from "../repositories/LastSelectedTabRepository";
import ConsoleClient from "../clients/ConsoleClient";

@injectable()
export class CommandRegistryFactory {
  private readonly propertyRegistry: PropertyRegistry;

  private readonly bufferCommandHelper: BufferCommandHelper;

  constructor(
    @inject("PropertyRegistry")
    propertyRegistry: PropertyRegistry,
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient,
    @inject("PropertySettings")
    private readonly propertySettings: PropertySettings,
    @inject("SearchEngineSettings")
    private readonly searchEngineSettings: SearchEngineSettings,
    @inject("LastSelectedTabRepository")
    private readonly lastSelectedTabRepository: LastSelectedTabRepository,
  ) {
    this.propertyRegistry = propertyRegistry;
    this.bufferCommandHelper = new BufferCommandHelper(
      this.lastSelectedTabRepository,
    );
  }

  create(): CommandRegistry {
    const registory = new CommandRegistryImpl();

    registory.register(new AddBookmarkCommand(this.consoleClient));
    registory.register(
      new BufferCommand(
        this.lastSelectedTabRepository,
        this.bufferCommandHelper,
      ),
    );
    registory.register(new BufferDeleteCommand(this.bufferCommandHelper));
    registory.register(new BufferDeletesCommand(this.bufferCommandHelper));
    registory.register(new HelpCommand());
    registory.register(
      new OpenCommand(this.searchEngineSettings, this.propertySettings),
    );
    registory.register(
      new TabOpenCommand(this.searchEngineSettings, this.propertySettings),
    );
    registory.register(
      new WindowOpenCommand(this.searchEngineSettings, this.propertySettings),
    );
    registory.register(new QuitAllCommand());
    registory.register(new QuitCommand());
    registory.register(
      new SetCommand(
        this.propertySettings,
        this.propertyRegistry,
        this.consoleClient,
      ),
    );

    return registory;
  }
}
