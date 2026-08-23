import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { AuthContext } from "../../../context/AuthContext";
import { login as loginUser } from "../authApi";
import LoginForm from "./LoginForm";

vi.mock("../authApi", () => ({
  getMe: vi.fn(),
  login: vi.fn()
}));

const mockedLoginUser = vi.mocked(loginUser);

const renderLoginForm = () => {
  const handleLogin = vi.fn();

  render(
    <MemoryRouter>
      <AuthContext.Provider
        value={{
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          login: handleLogin,
          logout: vi.fn(),
          updateUser: vi.fn()
        }}
      >
        <LoginForm />
      </AuthContext.Provider>
    </MemoryRouter>
  );

  return { handleLogin };
};

describe("LoginForm", () => {
  beforeEach(() => {
    mockedLoginUser.mockReset();
  });

  test("displays validation errors when submitted without credentials", async () => {
    // Arrange
    const user = userEvent.setup();

    const { handleLogin } = renderLoginForm();

    const emailInput = screen.getByRole("textbox", {
      name: "EMAIL ADDRESS"
    });

    const passwordInput = screen.getByLabelText("PASSWORD");

    const submitButton = screen.getByRole("button", {
      name: "Sign in to Dashboard"
    });

    // Act
    await user.click(submitButton);

    const emailError = await screen.findByText("Enter a valid email");
    const passwordError = await screen.findByText("Password is required");

    // Assert
    expect(emailError).toBeInTheDocument();
    expect(passwordError).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("aria-invalid", "true");
    expect(passwordInput).toHaveAttribute("aria-invalid", "true");
    expect(handleLogin).not.toHaveBeenCalled();
  });

  test("logs in the user when valid credentials are submitted", async () => {
    // Arrange
    const user = userEvent.setup();

    const returnedUser = {
      id: 1,
      name: "Test User",
      email: "user@example.com",
      createdAt: "2026-08-23T00:00:00.000Z"
    };

    mockedLoginUser.mockResolvedValue({
      user: returnedUser,
      token: "test-token"
    });

    const { handleLogin } = renderLoginForm();

    const emailInput = screen.getByRole("textbox", {
      name: "EMAIL ADDRESS"
    });

    const passwordInput = screen.getByLabelText("PASSWORD");

    const submitButton = screen.getByRole("button", {
      name: "Sign in to Dashboard"
    });

    // Act
    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    // Assert
    expect(mockedLoginUser).toHaveBeenCalledTimes(1);
    expect(mockedLoginUser).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password123"
    });

    expect(handleLogin).toHaveBeenCalledTimes(1);
    expect(handleLogin).toHaveBeenCalledWith(returnedUser, "test-token");
  });

  test("displays an error when the login request fails", async () => {
    // Arrange
    const user = userEvent.setup();

    mockedLoginUser.mockRejectedValue(new Error("Invalid credentials"));

    const { handleLogin } = renderLoginForm();

    const emailInput = screen.getByRole("textbox", {
      name: "EMAIL ADDRESS"
    });

    const passwordInput = screen.getByLabelText("PASSWORD");

    const submitButton = screen.getByRole("button", {
      name: "Sign in to Dashboard"
    });

    // Act
    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    // Assert
    expect(mockedLoginUser).toHaveBeenCalledTimes(1);
    expect(mockedLoginUser).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password123"
    });
    const loginError = await screen.findByText("Invalid credentials");
    expect(loginError).toBeInTheDocument();
    expect(handleLogin).not.toHaveBeenCalled();
  });
});
