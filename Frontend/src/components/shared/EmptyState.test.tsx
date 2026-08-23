import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import EmptyState from "./EmptyState";

describe("EmptyState", () => {
  test("displays its title and description", () => {
    render(
      <EmptyState
        title="No applications yet"
        description="Add your first application to get started."
      />
    );

    const region = screen.getByRole("region", {
      name: "No applications yet"
    });

    const heading = screen.getByRole("heading", {
      level: 2,
      name: "No applications yet"
    });

    const description = screen.getByText(
      "Add your first application to get started."
    );

    expect(region).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  test("displays an action when one is provided", () => {
    render(
      <EmptyState
        title="No applications yet"
        description="Add your first application to get started."
        action={<button>Add application</button>}
      />
    );

    const button = screen.getByRole("button", {
      name: "Add application"
    });

    expect(button).toBeInTheDocument();
  });
});
