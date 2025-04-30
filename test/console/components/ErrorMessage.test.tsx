/**
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { ErrorMessage } from "../../../src/console/components/ErrorMessage";
import { describe, it, expect } from "vitest";

describe("console/components/console/completion/ErrorMessage", () => {
  it("renders an error message", () => {
    render(<ErrorMessage>Hello!</ErrorMessage>);

    const p = screen.getByRole("alert");
    expect(p.textContent).toEqual("Hello!");
  });
});
