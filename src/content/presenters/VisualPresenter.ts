import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import { FinderRepository } from "../repositories/FinderRepository";
import { SettingRepository } from "../repositories/SettingRepository";
import type { FindRange } from "../repositories/FinderRepository";

export interface VisualPresenter {
  isValidCarret(): boolean;
  updateCarrets(): void;
  select(): void;
  moveLeft(): void;
  moveRight(): void;
  moveNextWord(): void;
  moveEndWord(): void;
  movePrevWord(): void;
}

export const VisualPresenter = Symbol("VisualPresenter");

@provide(VisualPresenter)
export class VisualPresenterImpl implements VisualPresenter {
  private initCarretPosition: FindRange;
  private currentCarretPosition: FindRange;
  private tempCarretPosition: FindRange;
  private ignoreNodes: boolean | string | number;

  constructor(
    @inject(FinderRepository)
    private readonly finderRepository: FinderRepository,
    @inject(SettingRepository)
    private readonly settingRepository: SettingRepository,
  ) {
    this.ignoreNodes = this.settingRepository.getProperties()["ignorenodes"];
    const mockFindRange: FindRange = [
      {
        node: document.createTextNode("start"),
        offset: 0,
        textNodePos: 0,
      },
      {
        node: document.createTextNode("end"),
        offset: 3,
        textNodePos: 0,
      },
    ];
    this.initCarretPosition = [
      { ...mockFindRange[0] },
      { ...mockFindRange[1] },
    ];

    this.currentCarretPosition = [
      { ...mockFindRange[0] },
      { ...mockFindRange[1] },
    ];

    this.tempCarretPosition = [
      { ...mockFindRange[0] },
      { ...mockFindRange[1] },
    ];
  }

  updateCarrets(): void {
    const currentCarretPosition = this.finderRepository.getCurrentMatch();

    this.initCarretPosition = [
      { ...currentCarretPosition[0] },
      { ...currentCarretPosition[1] },
    ];

    this.currentCarretPosition = [
      { ...currentCarretPosition[0] },
      { ...currentCarretPosition[1] },
    ];

    this.tempCarretPosition = [
      { ...currentCarretPosition[0] },
      { ...currentCarretPosition[1] },
    ];
  }

  isValidCarret(): boolean {
    const currentMatch = JSON.stringify(this.initCarretPosition);
    const newMatch = JSON.stringify(this.finderRepository.getCurrentMatch());

    return !!this.currentCarretPosition && currentMatch === newMatch;
  }

  select(): void {
    this.adjustRange();
    this.finderRepository.select(this.tempCarretPosition);
  }

  private adjustRange(): void {
    const compare = (
      a: { textNodePos: number; offset: number },
      b: { textNodePos: number; offset: number },
    ): number => {
      return a.textNodePos !== b.textNodePos
        ? a.textNodePos - b.textNodePos
        : a.offset - b.offset;
    };

    const init = this.initCarretPosition[0];
    const temp = this.tempCarretPosition[1];
    const nodes = getNodes();

    const [start, end] = compare(temp, init) < 0 ? [temp, init] : [init, temp];

    this.currentCarretPosition = [
      {
        node: nodes[start.textNodePos],
        offset: start.offset,
        textNodePos: start.textNodePos,
      },
      {
        node: nodes[end.textNodePos],
        offset: end.offset,
        textNodePos: end.textNodePos,
      },
    ];
  }

  private getText(): string {
    return this.tempCarretPosition[1].node.data;
  }

  private isWordChar(char: string): boolean {
    return (
      !!char &&
      ![
        " ",
        "\t",
        "\n",
        ".",
        ",",
        ";",
        "!",
        "?",
        ":",
        "(",
        ")",
        "[",
        "]",
        "{",
        "}",
        "-",
        "_",
        '"',
        "'",
      ].includes(char)
    );
  }

  private isNotBorder(position: number, borderSize: number): boolean {
    return this.ignoreNodes ? true : position >= 0 && position < borderSize;
  }

  private moveCarretLeft(): void {
    if (this.tempCarretPosition[1].offset > 0) {
      this.tempCarretPosition[1].offset--;
    } else if (this.tempCarretPosition[1].textNodePos > 0) {
      this.tempCarretPosition[1].textNodePos--;
      const node = getNodes()[this.tempCarretPosition[1].textNodePos];
      this.tempCarretPosition[1].node = node;
      this.tempCarretPosition[1].offset = node.data.length;
    }
  }

  private moveCarretRight(): void {
    const nodes = getNodes();
    const node = this.tempCarretPosition[1].node;

    if (this.tempCarretPosition[1].offset < node.data.length) {
      this.tempCarretPosition[1].offset++;
    } else if (this.tempCarretPosition[1].textNodePos < nodes.length - 1) {
      this.tempCarretPosition[1].textNodePos++;
      const nextNode = nodes[this.tempCarretPosition[1].textNodePos];
      this.tempCarretPosition[1].node = nextNode;
      this.tempCarretPosition[1].offset = 0;
    }
  }

  moveLeft(): void {
    this.moveCarretLeft();
  }

  moveRight(): void {
    this.moveCarretRight();
  }

  moveNextWord(): void {
    let text = this.getText();
    let makeStep = true;

    while (
      this.isWordChar(text[this.tempCarretPosition[1].offset]) &&
      this.isNotBorder(this.tempCarretPosition[1].offset, text.length)
    ) {
      if (!text[this.tempCarretPosition[1].offset]) {
        text = this.getText();
      }
      this.moveCarretRight();
      makeStep = false;
    }

    while (
      !this.isWordChar(text[this.tempCarretPosition[1].offset]) &&
      this.isNotBorder(this.tempCarretPosition[1].offset, text.length)
    ) {
      if (!text[this.tempCarretPosition[1].offset]) {
        text = this.getText();
      }
      this.moveCarretRight();
      makeStep = false;
    }

    if (makeStep) {
      this.moveCarretRight();
    }
  }

  moveEndWord(): void {
    let text = this.getText();
    let makeStep = true;

    if (this.isWordChar(text[this.tempCarretPosition[1].offset])) {
      while (
        this.isWordChar(text[this.tempCarretPosition[1].offset]) &&
        this.isNotBorder(this.tempCarretPosition[1].offset, text.length)
      ) {
        if (!text[this.tempCarretPosition[1].offset]) {
          text = this.getText();
        }
        makeStep = false;
        this.moveCarretRight();
      }
    } else {
      while (
        !this.isWordChar(text[this.tempCarretPosition[1].offset]) &&
        this.isNotBorder(this.tempCarretPosition[1].offset, text.length)
      ) {
        if (!text[this.tempCarretPosition[1].offset]) {
          text = this.getText();
        }
        makeStep = false;
        this.moveCarretRight();
      }

      while (
        this.isWordChar(text[this.tempCarretPosition[1].offset]) &&
        this.isNotBorder(this.tempCarretPosition[1].offset, text.length)
      ) {
        if (!text[this.tempCarretPosition[1].offset]) {
          text = this.getText();
        }
        makeStep = false;
        this.moveCarretRight();
      }
    }

    if (makeStep) {
      this.moveCarretRight();
    }
  }

  movePrevWord(): void {
    let text = this.getText();
    let makeStep = true;

    while (
      !this.isWordChar(text[this.tempCarretPosition[1].offset]) &&
      this.isNotBorder(this.tempCarretPosition[1].offset, text.length)
    ) {
      if (!text[this.tempCarretPosition[1].offset]) {
        text = this.getText();
      }
      this.moveCarretLeft();
      makeStep = false;
    }

    while (
      this.isWordChar(text[this.tempCarretPosition[1].offset]) &&
      this.isNotBorder(this.tempCarretPosition[1].offset, text.length)
    ) {
      if (!text[this.tempCarretPosition[1].offset]) {
        text = this.getText();
      }
      this.moveCarretLeft();
      makeStep = false;
    }

    if (makeStep) {
      this.moveCarretLeft();
    }
  }
}

function getNodes(): Text[] {
  const walker = document.createTreeWalker(document, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let node: Node | null;

  while ((node = walker.nextNode())) {
    nodes.push(node as Text);
  }

  return nodes;
}
