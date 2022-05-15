/**
 * @jest-environment jsdom
 */

import AbstractHint, {
  LinkHint,
  InputHint,
} from "../../../src/content/presenters/Hint";

class Hint extends AbstractHint {}

describe("Hint", () => {
  beforeEach(() => {
    document.body.innerHTML = `<a id='test-link' href='#'>link</a>`;
  });

  describe("#constructor", () => {
    it("creates a hint element with tag name", () => {
      const link = document.getElementById("test-link")!;
      new Hint(link, "abc");

      const elem = document.querySelector(".vimvixen-hint");
      expect(elem!.textContent!.trim()).toEqual("abc");
    });
  });

  describe("#show", () => {
    it("shows an element", () => {
      const link = document.getElementById("test-link")!;
      const hint = new Hint(link, "abc");
      hint.hide();
      hint.show();

      const elem = document.querySelector(".vimvixen-hint") as HTMLElement;
      expect(elem.style.display).not.toEqual("none");
    });
  });

  describe("#hide", () => {
    it("hides an element", () => {
      const link = document.getElementById("test-link") as HTMLElement;
      const hint = new Hint(link, "abc");
      hint.hide();

      const elem = document.querySelector(".vimvixen-hint") as HTMLElement;
      expect(elem.style.display).toEqual("none");
    });
  });

  describe("#remove", () => {
    it("removes an element", () => {
      const link = document.getElementById("test-link")!;
      const hint = new Hint(link, "abc");

      const elem = document.querySelector(".vimvixen-hint")!;
      expect(elem.parentElement).not.toBeNull;
      hint.remove();
      expect(elem.parentElement).toBeNull;
    });
  });
});

describe("LinkHint", () => {
  beforeEach(() => {
    document.body.innerHTML = `
<a id='test-link1' href='https://google.com/'>link</a>
<a id='test-link2' href='https://yahoo.com/' target='_blank'>link</a>
<a id='test-link3' href='#' target='_blank'>link</a>
`;
  });

  describe("#getLink()", () => {
    it('returns value of "href" attribute', () => {
      const link = document.getElementById("test-link1") as HTMLAnchorElement;
      const hint = new LinkHint(link, "abc");

      expect(hint.getLink()).toEqual("https://google.com/");
    });
  });

  describe("#getLinkTarget()", () => {
    it('returns value of "target" attribute', () => {
      let link = document.getElementById("test-link1") as HTMLAnchorElement;
      let hint = new LinkHint(link, "abc");

      expect(hint.getLinkTarget()).toBeNull;

      link = document.getElementById("test-link2") as HTMLAnchorElement;
      hint = new LinkHint(link, "abc");

      expect(hint.getLinkTarget()).toEqual("_blank");
    });
  });

  describe("#click()", () => {
    it("clicks a element", (done) => {
      const link = document.getElementById("test-link3") as HTMLAnchorElement;
      const hint = new LinkHint(link, "abc");
      link.onclick = () => {
        done();
      };

      hint.click();
    });
  });
});

describe("InputHint", () => {
  describe("#activate()", () => {
    describe("<input>", () => {
      beforeEach(() => {
        document.body.innerHTML = `<input id='test-input'></input>`;
      });

      it("focuses to the input", () => {
        const input = document.getElementById("test-input") as HTMLInputElement;
        const hint = new InputHint(input, "abc");
        hint.activate();

        expect(document.activeElement).toEqual(input);
      });
    });

    describe('<input type="checkbox">', () => {
      beforeEach(() => {
        document.body.innerHTML = `<input type="checkbox" id='test-input'></input>`;
      });

      it("checks and focuses to the input", () => {
        const input = document.getElementById("test-input") as HTMLInputElement;
        const hint = new InputHint(input, "abc");
        hint.activate();

        expect(input.checked).toBeTruthy;
      });
    });
    describe("<textarea>", () => {
      beforeEach(() => {
        document.body.innerHTML = `<textarea id='test-textarea'></textarea>`;
      });

      it("focuses to the textarea", () => {
        const textarea = document.getElementById(
          "test-textarea"
        ) as HTMLTextAreaElement;
        const hint = new InputHint(textarea, "abc");
        hint.activate();

        expect(document.activeElement).toEqual(textarea);
      });
    });

    describe("<button>", () => {
      beforeEach(() => {
        document.body.innerHTML = `<button id='test-button'></button>`;
      });

      it("clicks the button", (done) => {
        const button = document.getElementById(
          "test-button"
        ) as HTMLButtonElement;
        button.onclick = () => {
          done();
        };

        const hint = new InputHint(button, "abc");
        hint.activate();
      });
    });
  });
});
