/**
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { CompletionList } from "../../../../src/console/completion/components/CompletionList";
import { describe, it, expect } from "vitest";

describe("CompletionList", () => {
  const completions = [
    {
      name: "Fruit",
      items: [
        { primary: "apple" },
        { primary: "banana" },
        { primary: "cherry" },
      ],
    },
    {
      name: "Element",
      items: [
        { primary: "argon" },
        { primary: "boron" },
        { primary: "carbon" },
      ],
    },
  ];

  it("renders Completion component", () => {
    render(<CompletionList completions={completions} size={30} select={-1} />);

    const groups = screen.getAllByRole("group");
    expect(groups).toHaveLength(2);

    const fluitGroup = screen.getByLabelText("Fruit");
    const fluitItems = fluitGroup.querySelectorAll("[role=menuitem]");
    expect(Array.from(fluitItems).map((item) => item.textContent)).toEqual([
      "apple",
      "banana",
      "cherry",
    ]);

    const elementGroup = screen.getByLabelText("Element");
    const elementItems = elementGroup.querySelectorAll("[role=menuitem]");
    expect(Array.from(elementItems).map((item) => item.textContent)).toEqual([
      "argon",
      "boron",
      "carbon",
    ]);
  });

  it("highlight current item", () => {
    render(<CompletionList completions={completions} size={30} select={3} />);

    const item = screen.getByRole("menuitem", { current: true });
    expect(item.textContent).toEqual("argon");
  });

  it("does not highlight any items", () => {
    render(<CompletionList completions={completions} size={30} select={-1} />);

    expect(() => screen.getByRole("menuitem", { current: true })).toThrow();
  });

  it("limits completion items", () => {
    render(<CompletionList completions={completions} size={3} select={-1} />);

    const items = screen.getAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual(["apple", "banana"]);
  });

  it("scrolls up to down with select", () => {
    const { rerender } = render(
      <CompletionList completions={completions} size={3} select={0} />,
    );
    expect(screen.getByRole("menuitem", { current: true }).textContent).toEqual(
      "apple",
    );
    expect(
      screen.getAllByRole("menuitem").map((item) => item.textContent),
    ).toEqual([
      // [Fruit]
      "apple",
      "banana",
    ]);

    rerender(<CompletionList completions={completions} size={3} select={2} />);
    expect(screen.getByRole("menuitem", { current: true }).textContent).toEqual(
      "cherry",
    );
    expect(
      screen.getAllByRole("menuitem").map((item) => item.textContent),
    ).toEqual(["apple", "banana", "cherry"]);

    rerender(<CompletionList completions={completions} size={3} select={3} />);
    expect(screen.getByRole("menuitem", { current: true }).textContent).toEqual(
      "argon",
    );
    expect(
      screen.getAllByRole("menuitem").map((item) => item.textContent),
    ).toEqual([
      "cherry",
      // [Element]
      "argon",
    ]);
  });

  it("scrolls down to up with select", () => {
    const { rerender } = render(
      <CompletionList completions={completions} size={3} select={5} />,
    );
    expect(screen.getByRole("menuitem", { current: true }).textContent).toEqual(
      "carbon",
    );
    expect(
      screen.getAllByRole("menuitem").map((item) => item.textContent),
    ).toEqual(["argon", "boron", "carbon"]);

    rerender(<CompletionList completions={completions} size={3} select={4} />);
    expect(screen.getByRole("menuitem", { current: true }).textContent).toEqual(
      "boron",
    );
    expect(
      screen.getAllByRole("menuitem").map((item) => item.textContent),
    ).toEqual(["argon", "boron", "carbon"]);

    rerender(<CompletionList completions={completions} size={3} select={3} />);
    expect(screen.getByRole("menuitem", { current: true }).textContent).toEqual(
      "argon",
    );
    expect(
      screen.getAllByRole("menuitem").map((item) => item.textContent),
    ).toEqual(["argon", "boron", "carbon"]);

    rerender(<CompletionList completions={completions} size={3} select={2} />);
    expect(screen.getByRole("menuitem", { current: true }).textContent).toEqual(
      "cherry",
    );
    expect(
      screen.getAllByRole("menuitem").map((item) => item.textContent),
    ).toEqual([
      "cherry",
      // [Element]
      "argon",
    ]);
  });
});
