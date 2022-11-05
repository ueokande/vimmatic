/**
 * @jest-environment jsdom
 */

import React from "react";
import ReactDOM from "react-dom";
import ReactTestRenderer from "react-test-renderer";
import ReactTestUtils from "react-dom/test-utils";
import SearchForm from "../../../../src/options/components/form/SearchForm";

describe("options/form/SearchForm", () => {
  describe("render", () => {
    it("renders SearchForm", () => {
      const root = ReactTestRenderer.create(
        <SearchForm
          value={{
            default: "google",
            engines: [
              { name: "google", url: "google.com" },
              { name: "yahoo", url: "yahoo.com" },
            ],
          }}
        />
      ).root;

      const names = root
        .findAllByType("input")
        .filter((instance) => instance.props.name === "name");
      expect(names).toHaveLength(2);
      expect(names[0].props.value).toEqual("google");
      expect(names[1].props.value).toEqual("yahoo");

      const urls = root
        .findAllByType("input")
        .filter((instance) => instance.props.name === "url");
      expect(urls).toHaveLength(2);
      expect(urls[0].props.value).toEqual("google.com");
      expect(urls[1].props.value).toEqual("yahoo.com");
    });
  });

  describe("onChange event", () => {
    let container: HTMLDivElement;

    beforeEach(() => {
      container = document.createElement("div");
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container);
    });

    it("invokes onChange event on edit", (done) => {
      ReactTestUtils.act(() => {
        ReactDOM.render(
          <SearchForm
            value={{
              default: "google",
              engines: [
                { name: "google", url: "google.com" },
                { name: "yahoo", url: "yahoo.com" },
              ],
            }}
            onChange={(form) => {
              expect(form.default).toEqual("louvre");
              expect(form.engines).toHaveLength(2);
              expect(form.engines).toEqual([
                { name: "louvre", url: "google.com" },
                { name: "yahoo", url: "yahoo.com" },
              ]);
              done();
            }}
          />,
          container
        );
      });

      const radio = document.querySelector(
        "input[type=radio]"
      ) as HTMLInputElement;
      radio.checked = true;

      const name = document.querySelector(
        "input[name=name]"
      ) as HTMLInputElement;
      name.value = "louvre";

      ReactTestUtils.Simulate.change(name);
    });

    it("invokes onChange event on delete", (done) => {
      ReactTestUtils.act(() => {
        ReactDOM.render(
          <SearchForm
            value={{
              default: "yahoo",
              engines: [
                { name: "louvre", url: "google.com" },
                { name: "yahoo", url: "yahoo.com" },
              ],
            }}
            onChange={(form) => {
              expect(form.default).toEqual("yahoo");
              expect(form.engines).toHaveLength(1);
              expect(form.engines).toEqual([
                { name: "yahoo", url: "yahoo.com" },
              ]);
              done();
            }}
          />,
          container
        );
      });

      const button = document.querySelector(
        "input[type=button]"
      ) as HTMLInputElement;
      ReactTestUtils.Simulate.click(button);
    });

    it("invokes onChange event on add", (done) => {
      ReactTestUtils.act(() => {
        ReactDOM.render(
          <SearchForm
            value={{
              default: "yahoo",
              engines: [{ name: "google", url: "google.com" }],
            }}
            onChange={(form) => {
              expect(form.default).toEqual("yahoo");
              expect(form.engines).toHaveLength(2);
              expect(form.engines).toEqual([
                { name: "google", url: "google.com" },
                { name: "", url: "" },
              ]);
              done();
            }}
          />,
          container
        );
      });

      const button = document.querySelector(
        "input[type=button][name=add]"
      ) as HTMLInputElement;
      ReactTestUtils.Simulate.click(button);
    });
  });
});
