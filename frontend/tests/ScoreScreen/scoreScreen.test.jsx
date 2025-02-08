import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import MockScoreScreen from "./mockScoreScreen";

describe("ScoreScreen renders", () => {
  it("Shows loading screen before receiving data", () => {
    render(<MockScoreScreen />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("Shows the score after data is received", async () => {
    render(<MockScoreScreen />);

    // Wait for the score to appear
    await waitFor(() => {
      expect(screen.queryByText("88493")).toBeInTheDocument();
    });
  });

  it("Doesn't show the score before data is received", () => {
    render(<MockScoreScreen />);
    expect(screen.queryByText("88493")).not.toBeInTheDocument();
  });

  it("Doesn't show the loading screen after data is received", async () => {
    render(<MockScoreScreen />);
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
  });

  it("Shows a leaderboard of top 3 scores", async () => {
    render(<MockScoreScreen />);
    const scoresToCheck = [75000, 50000, 25000];
    const initialsToCheck = ["GUD", "LOL", "NUB"];
    await waitFor(() => {
      scoresToCheck.forEach((score) => {
        expect(screen.getByText(score.toString())).toBeInTheDocument();
      });

      initialsToCheck.forEach((initials) => {
        expect(screen.getByText(initials)).toBeInTheDocument();
      });
    });
  });
});
