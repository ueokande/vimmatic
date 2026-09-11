import { inject, injectable } from "inversify";
import { ConsoleClient } from "../clients/ConsoleClient";
import { PropertyRegistry } from "../property/PropertyRegistry";
import { LastSelectedTabRepository } from "../repositories/LastSelectedTabRepository";
import { PropertySettings } from "../settings/PropertySettings";
import { SearchEngineSettings } from "../settings/SearchEngineSettings";
import { AddBookmarkCommand } from "./AddBookmarkCommand";
import { BufferCommand } from "./BufferCommand";
import { BufferDeleteCommand } from "./BufferDeleteCommand";
import { BufferDeletesCommand } from "./BufferDeletesCommand";
import type { CommandRegistry } from "./CommandRegistry";
import { CommandRegistryImpl } from "./CommandRegistry";
import { HelpCommand } from "./HelpCommand";
import { OpenCommand } from "./OpenCommand";
import { PinCommand } from "./PinCommand";
import { QuitAllCommand } from "./QuitAllCommand";
import { QuitCommand } from "./QuitCommand";
import { SetCommand } from "./SetCommand";
import { TabOpenCommand } from "./TabOpenCommand";
import { TabQueryHelper } from "./TabQueryHelper";
import { TogglePinCommand } from "./TogglePinCommand";
import { UnpinCommand } from "./UnpinCommand";
import { WindowOpenCommand } from "./WindowOpenCommand";

@injectable()
export class CommandRegistryFactory {
  private readonly tabQueryHelper: TabQueryHelper;

  constructor(
    @inject(PropertyRegistry)
    private readonly propertyRegistry: PropertyRegistry,
    @inject(ConsoleClient)
    private readonly consoleClient: ConsoleClient,
    @inject(PropertySettings)
    private readonly propertySettings: PropertySettings,
    @inject(SearchEngineSettings)
    private readonly searchEngineSettings: SearchEngineSettings,
    @inject(LastSelectedTabRepository)
    private readonly lastSelectedTabRepository: LastSelectedTabRepository,
  ) {
    this.tabQueryHelper = new TabQueryHelper(this.lastSelectedTabRepository);
  }

  create(): CommandRegistry {
    const registory = new CommandRegistryImpl();

    registory.register(new AddBookmarkCommand(this.consoleClient));
    registory.register(
      new BufferCommand(this.lastSelectedTabRepository, this.tabQueryHelper),
    );
    registory.register(new BufferDeleteCommand(this.tabQueryHelper));
    registory.register(new BufferDeletesCommand(this.tabQueryHelper));
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
    registory.register(new PinCommand(this.tabQueryHelper, this.consoleClient));
    registory.register(
      new UnpinCommand(this.tabQueryHelper, this.consoleClient),
    );
    registory.register(
      new TogglePinCommand(this.tabQueryHelper, this.consoleClient),
    );

    return registory;
  }
}
