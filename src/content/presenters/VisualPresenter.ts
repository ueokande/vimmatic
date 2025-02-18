import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import { FinderRepository } from "../repositories/FinderRepository";
import type { FindRange } from "../repositories/FinderRepository";

export interface VisualPresenter {
    
    select(): void

    moveLeft(): void

    moveRight(): void

    moveNextWord(): void

    moveEndWord(): void

    movePrevWord(): void
    
}


export const VisualPresenter = Symbol("VisualPresenter");

@provide(VisualPresenter)
export class VisualPresenterImpl implements VisualPresenter {
  private currentCarretPosition: FindRange
  private startOffset: number 
  private endOffset: number
  private startNode: Text
  private endNode: Text

  constructor(
    @inject(FinderRepository)
    private readonly finderRepository: FinderRepository,
  ) {
    const currentCarretPosition = finderRepository.getCurrentCarretPosition();
    this.currentCarretPosition = currentCarretPosition;
    if (!currentCarretPosition) {
        return
    }
    this.startOffset = currentCarretPosition[0].offset 
    this.endOffset = currentCarretPosition[1].offset
    this.startNode = currentCarretPosition[0].node
    this.endNode = currentCarretPosition[1].node
  }

  select(): void {
      this.adjustRange();
      const range: FindRange = [ 
          {node: this.startNode, offset: this.startOffset},
          {node: this.endNode, offset: this.endOffset},
      ]
      this.finderRepository.select(range);
  }

  getTextNodeIndex(node: Text): number {
    if (!node.parentNode) return -1;
        const textNodes = Array.from(node.parentNode.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
        return textNodes.indexOf(node);
    }
  getText(): string { 
      const initCarrentPosition = this.finderRepository.getCurrentMatch(); 
      if (this.getTextNodeIndex(this.startNode) >= this.getTextNodeIndex(initCarrentPosition[0].node)) {
          return this.endNode.data
      } else {
          return this.startNode.data
      }
  }
  
  isWordChar(char: string): boolean {
        return ![" ", "\t", "\n", ".", ",", ";", "!", "?", ":", "(", ")", "[", "]", "{", "}", "-", "_", "\"", "'"].includes(char);
    }

   isBorder(position: number, borderSize: number) {
      return (position > 0) && (position < borderSize)
   }

  adjustRange(): void {
    const initCarrentPosition = this.finderRepository.getCurrentMatch();
    const currentStartNodePos = this.getTextNodeIndex(this.currentCarretPosition[0].node);
    const currentEndNodePos = this.getTextNodeIndex(this.currentCarretPosition[1].node);
    const initStartNodePos = this.getTextNodeIndex(initCarrentPosition[0].node);
    if (
      this.endOffset <= initCarrentPosition[0].offset && 
      currentStartNodePos >= currentEndNodePos
    ) {
      [this.currentCarretPosition[0].node, this.currentCarretPosition[1].node] = [this.currentCarretPosition[1].node, this.currentCarretPosition[0].node];
      this.currentCarretPosition[1].offset = this.endOffset;
      [this.startOffset, this.endOffset] = [this.endOffset, initCarrentPosition[0].offset];
    } else if (currentStartNodePos < initStartNodePos) { 
      this.currentCarretPosition[1].offset = this.endOffset;
      [this.startOffset, this.endOffset] = [this.endOffset, initCarrentPosition[0].offset];
    } else { 
      this.currentCarretPosition[1].offset = this.endOffset;
      this.currentCarretPosition[0].offset = this.startOffset;
    }

    if (this.endOffset > this.endNode.length) {
      this.endNode = this.endNode.nextSibling;
      this.endOffset = 0;
      this.currentCarretPosition[1].offset = this.endOffset;
    } else if (this.endOffset < 0) {
      this.endNode = this.endNode.previousSibling;
      this.endOffset = this.endNode.data.length;
      this.currentCarretPosition[1].offset = this.endOffset;
    } else if (this.startOffset <= 0) {
      this.endNode = this.startNode;
      this.startNode = this.startNode.previousSibling;
      this.startOffset = this.startNode.data.length;
      this.endOffset = initCarrentPosition[0].offset;
      this.currentCarretPosition[0].offset = this.endOffset;
      this.currentCarretPosition[1].offset = this.startOffset;
    } else if (this.startOffset > this.startNode.length) {
      this.startNode = this.startNode.nextSibling;
      this.startOffset = 0;
      this.endOffset = initCarrentPosition[0].offset;
      this.currentCarretPosition[1].offset = this.startOffset;
    }
  }

  moveNextWord(): void {
     const text = this.getText();
     let makeStep: boolean = true;
     while (this.isWordChar(text[this.endOffset]) && this.isBorder(this.endOffset, text.length)) {
          this.endOffset++;
          makeStep = false;
        }
     while (!this.isWordChar(text[this.endOffset]) && this.isBorder(this.endOffset, text.length)) {
          this.endOffset++;
          makeStep = false;
     }
     if (makeStep) { this.endOffset++; }
 
  }

  moveEndWord(): void {
     const text = this.getText();
     let makeStep: boolean = true;
     while (!this.isWordChar(text[this.endOffset]) && this.isBorder(this.endOffset, text.length)) {
          this.endOffset++;
          makeStep = false;
        }
     while (this.isWordChar(text[this.endOffset]) && this.isBorder(this.endOffset, text.length)) {
          this.endOffset++;
          makeStep = false;
     }
     if (makeStep) { this.endOffset++; }
      
  }

  movePrevWord(): void {
     const text = this.getText();
     let makeStep: boolean = true;
     while (!this.isWordChar(text[this.endOffset]) && this.isBorder(this.endOffset, text.length)) {
          this.endOffset--;
          makeStep = false;
        }
     while (this.isWordChar(text[this.endOffset]) && this.isBorder(this.endOffset, text.length)) {
          this.endOffset--;
          makeStep = false;
     }
     if (makeStep) { this.endOffset++; }
      
  }

 
  moveRight() {
      this.endOffset++;
  }

  moveLeft() {
      this.endOffset--;
  }


}


