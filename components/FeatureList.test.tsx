import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeatureList } from "./FeatureList";

describe("FeatureList", () => {
  it("renders all three feature benefits", () => {
    render(<FeatureList />);

    expect(
      screen.getByRole("heading", { name: /automatic consolidation/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /timely reminders/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /no missed moments/i }),
    ).toBeInTheDocument();
  });
});
