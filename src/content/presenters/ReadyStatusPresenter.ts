import { provide } from "inversify-binding-decorators";

export interface ReadyStatusPresenter {
  setContentReady(): void;

  setConsoleReady(): void;
}

export const ReadyStatusPresenter = Symbol("ReadyStatusPresenter");

@provide(ReadyStatusPresenter)
export class ReadyStatusPresenterImpl {
  constructor(private readonly doc: Document = window.document) {}
  setContentReady() {
    this.doc.head.setAttribute("data-vimmatic-content-status", "ready");
  }

  setConsoleReady() {
    this.doc.head.setAttribute("data-vimmatic-console-status", "ready");
  }
}
