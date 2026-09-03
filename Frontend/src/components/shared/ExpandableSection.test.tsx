import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

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

  test("hides content when it is closed", async () => {
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

    // Act - open
    await user.click(button);

    // Assert - opened
    expect(screen.getByText("Hidden information")).toBeInTheDocument();

    // Act - close
    await user.click(button);

    // Assert - closed
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Hidden information")).not.toBeInTheDocument();
  });
});
