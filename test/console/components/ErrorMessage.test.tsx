/**
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ErrorMessage } from "../../../src/console/components/ErrorMessage";

describe("console/components/console/completion/ErrorMessage", () => {
  it("renders an error message", () => {
    render(<ErrorMessage>Hello!</ErrorMessage>);

    const p = screen.getByRole("alert");
    expect(p.textContent).toEqual("Hello!");
  });
});
