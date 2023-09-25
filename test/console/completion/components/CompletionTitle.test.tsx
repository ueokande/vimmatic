import React from "react";
import ReactTestRenderer from "react-test-renderer";
import CompletionTitle from "../../../../src/console/completion/components/CompletionTitle";

describe("console/components/console/completion/CompletionTitle", () => {
  it("renders a CompletionTitle", () => {
    const root = ReactTestRenderer.create(
      <CompletionTitle title="Fruits" shown={true} />,
    ).root;

    const li = root.findByType("li");
    expect(li.children).toEqual(["Fruits"]);
  });
});
