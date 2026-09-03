import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { forgotPassword } from "../authApi";
import ForgotPasswordForm from "./ForgotPasswordForm";

vi.mock("../authApi", () => ({
  forgotPassword: vi.fn()
}));

const mockedForgotPassword = vi.mocked(forgotPassword);

describe("ForgotPasswordForm", () => {
  beforeEach(() => {
    mockedForgotPassword.mockReset();
  });

  test("displays a validation error when submitted without an email", async () => {
    // Arrange
    const user = userEvent.setup();

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByRole("textbox", {
      name: "EMAIL ADDRESS"
    });

    const submitButton = screen.getByRole("button", {
      name: "Send reset link"
    });

    expect(emailInput).toHaveAttribute("aria-invalid", "false");

    // Act
    await user.click(submitButton);

    const validationError = await screen.findByText("Invalid email address");

    // Assert
    expect(validationError).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("aria-invalid", "true");
  });

  test("submits the email and displays the success message", async () => {
    // Arrange
    const user = userEvent.setup();

    mockedForgotPassword.mockResolvedValue({
      message: "Check your email for a reset link."
    });

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByRole("textbox", {
      name: "EMAIL ADDRESS"
    });

    const submitButton = screen.getByRole("button", {
      name: "Send reset link"
    });

    // Act
    await user.type(emailInput, "user@example.com");
    await user.click(submitButton);

    // Assert
    expect(mockedForgotPassword).toHaveBeenCalledTimes(1);
    expect(mockedForgotPassword).toHaveBeenCalledWith({
      email: "user@example.com"
    });

    const successMessage = await screen.findByRole("status");

    expect(successMessage).toBeInTheDocument();
    expect(successMessage).toHaveTextContent(
      "Check your email for a reset link."
    );
  });

  test("displays an error when the password reset request fails", async () => {
    // Arrange
    const user = userEvent.setup();

    mockedForgotPassword.mockRejectedValue(new Error("API Error"));

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByRole("textbox", {
      name: "EMAIL ADDRESS"
    });

    const submitButton = screen.getByRole("button", {
      name: "Send reset link"
    });

    // Act
    await user.type(emailInput, "user@example.com");
    await user.click(submitButton);

    // Assert
    expect(mockedForgotPassword).toHaveBeenCalledTimes(1);
    expect(mockedForgotPassword).toHaveBeenCalledWith({
      email: "user@example.com"
    });

    const errorMessage = await screen.findByRole("status");

    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent("API Error");
  });
});
