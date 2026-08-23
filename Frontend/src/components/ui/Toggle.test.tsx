import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Toggle from "./Toggle";

describe("Toggle", () => {
  test("requests the checked state when an unchecked toggle is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Toggle
        checked={false}
        onChange={handleChange}
        label="Email notifications"
      />
    );

    const toggle = screen.getByRole("switch", { name: "Email notifications" });
    expect(toggle).not.toBeChecked();

    // Act
    await user.click(toggle);

    // Assert
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  test("requests the unchecked state when a checked toggle is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Toggle
        checked={true}
        onChange={handleChange}
        label="Email notifications"
      />
    );

    const toggle = screen.getByRole("switch", { name: "Email notifications" });
    expect(toggle).toBeChecked();

    // Act
    await user.click(toggle);

    // Assert
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  test("when in disabled state, clicking the toggle does not call onChange", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Toggle
        checked={false}
        onChange={handleChange}
        label="Email notifications"
        disabled
      />
    );

    const toggle = screen.getByRole("switch", { name: "Email notifications" });
    expect(toggle).toBeDisabled();

    // Act
    await user.click(toggle);

    // Assert
    expect(handleChange).not.toHaveBeenCalled();
  });
});
