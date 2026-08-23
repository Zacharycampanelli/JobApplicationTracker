import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, test, vi } from "vitest";

import CancelModal from "./CancelModal";

describe("CancelModal", () => {
  test("closes when the user chooses to keep editing", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <MemoryRouter>
        <CancelModal isOpen onClose={handleClose} />
      </MemoryRouter>
    );

    const dialog = screen.getByRole("dialog", {
      name: "Discard changes?"
    });

    const keepEditingButton = screen.getByRole("button", {
      name: "Keep editing"
    });

    expect(dialog).toBeInTheDocument();

    await user.click(keepEditingButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test("does not display the dialog when closed", () => {
    const handleClose = vi.fn();

    render(
      <MemoryRouter>
        <CancelModal isOpen={false} onClose={handleClose} />
      </MemoryRouter>
    );

    const dialog = screen.queryByRole("dialog", {
      name: "Discard changes?"
    });

    expect(dialog).not.toBeInTheDocument();
  });

  test("closes and confirms when the user discards changes", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleClose = vi.fn();
    const handleConfirm = vi.fn();

    render(
      <MemoryRouter>
        <CancelModal isOpen onClose={handleClose} onConfirm={handleConfirm} />
      </MemoryRouter>
    );

    const discardButton = screen.getByRole("button", {
      name: "Discard changes"
    });

    // Act
    await user.click(discardButton);

    // Assert
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  test("navigates to the new location when changes are discarded", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <MemoryRouter initialEntries={["/edit"]}>
        <Routes>
          <Route
            path="/edit"
            element={
              <CancelModal
                isOpen
                onClose={handleClose}
                newLocation="/applications"
              />
            }
          />
          <Route path="/applications" element={<h1>Applications Page</h1>} />
        </Routes>
      </MemoryRouter>
    );

    const discardButton = screen.getByRole("button", {
      name: "Discard changes"
    });

    // Act
    await user.click(discardButton);

    // Assert
    expect(handleClose).toHaveBeenCalledTimes(1);

    const applicationsHeading = screen.getByRole("heading", {
      name: "Applications Page"
    });

    expect(applicationsHeading).toBeInTheDocument();
  });
});
