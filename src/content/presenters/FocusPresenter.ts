import { provide } from "inversify-binding-decorators";

export interface FocusPresenter {
  focusFirstElement(): boolean;
}

export const FocusPresenter = Symbol("FocusPresenter");

@provide(FocusPresenter)
export class FocusPresenterImpl implements FocusPresenter {
  focusFirstElement(): boolean {
    const inputTypes = ["email", "number", "search", "tel", "text", "url"];
    const inputSelector = inputTypes
      .map((type) => `input[type=${type}]`)
      .join(",");
    const targets = window.document.querySelectorAll(
      inputSelector + ",input:not([type]),textarea",
    );
    const target = Array.from(targets).find((e) =>
      e.checkVisibility({
        checkOpacity: true,
        checkVisibilityCSS: true,
      }),
    );
    if (target instanceof HTMLInputElement) {
      target.focus();
      return true;
    } else if (target instanceof HTMLTextAreaElement) {
      target.focus();
      return true;
    }
    return false;
  }
}
