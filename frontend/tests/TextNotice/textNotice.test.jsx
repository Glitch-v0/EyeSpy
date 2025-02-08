import { vi, describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import TextNotice from "../../src/components/TextNotice";

describe("TextNotice renders", () => {
  it("Shows the text notice and button", () => {
    render(<TextNotice text="Test text" setIndex={() => {}} />);
    expect(screen.getByText("Test text")).toBeInTheDocument();
    expect(screen.getByText("Close")).toBeInTheDocument();
  });
});

describe("Button interactions", () => {
  it("Calls setIndex on button press", () => {
    const setIndex = vi.fn();
    render(<TextNotice text="Test text" setIndex={setIndex} />);
    screen.getByText("Close").click();
    expect(setIndex).toHaveBeenCalled();
  });
  it("Dialog is open then closes on button click", async () => {
    const setIndex = vi.fn();
    render(<TextNotice text="Test text" setIndex={setIndex} />);

    // Check that the dialog is initially open
    let dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("open");

    // Click the button to close the dialog
    await act(async () => {
      screen.getByRole("button", { name: "Close" }).click();
    });
    // Check that the dialog is closed
    expect(dialog).not.toHaveAttribute("open");
  });
});
