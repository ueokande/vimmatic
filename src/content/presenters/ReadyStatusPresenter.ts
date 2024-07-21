import { injectable } from "inversify";

export interface ReadyStatusPresenter {
  setContentReady(): void;

  setConsoleReady(): void;
}

export const ReadyStatusPresenter = Symbol("ReadyStatusPresenter");

@injectable()
export class ReadyStatusPresenterImpl {
  constructor(private readonly doc: Document = window.document) {}
  setContentReady() {
    this.doc.head.setAttribute("data-vimmatic-content-status", "ready");
  }

  setConsoleReady() {
    this.doc.head.setAttribute("data-vimmatic-console-status", "ready");
  }
}
