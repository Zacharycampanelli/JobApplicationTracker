import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import userEvent from "@testing-library/user-event";

import ExpandableSection from "./ExpandableSection";

describe("ExpandableSection", () => {
  test("hides its content by default", () => {
    // Arrange
    render(
      <ExpandableSection title="More details">
        <p>Hidden information</p>
      </ExpandableSection>
    );

    // Assert
    const button = screen.getByRole("button", {
      name: "More details"
    });

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Hidden information")).not.toBeInTheDocument();
  });

  test("shows its content when opened", async () => {
    // Arrange
    const user = userEvent.setup();

    render(
      <ExpandableSection title="More details">
        <p>Hidden information</p>
      </ExpandableSection>
    );

    const button = screen.getByRole("button", {
      name: "More details"
    });

    // Act
    await user.click(button);

    // Assert
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Hidden information")).toBeInTheDocument();
  });
});
