import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ImprintPage from "./page";

describe("ImprintPage", () => {
  it("renders H1 above the source structure in order", () => {
    render(<ImprintPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Imprint" }),
    ).toBeInTheDocument();
  });

  it("renders exactly 2 H2s and 3 H3s in source order", () => {
    render(<ImprintPage />);

    const h2s = screen.getAllByRole("heading", { level: 2 });
    expect(h2s).toHaveLength(2);
    expect(h2s[0]).toHaveTextContent("Information pursuant to § 5 TMG");
    expect(h2s[1]).toHaveTextContent("Contact");

    const h3s = screen.getAllByRole("heading", { level: 3 });
    expect(h3s).toHaveLength(3);
    expect(h3s[0]).toHaveTextContent("Liability for Content");
    expect(h3s[1]).toHaveTextContent("Liability for Links");
    expect(h3s[2]).toHaveTextContent("Copyright");
  });

  it("renders a link back to home", () => {
    render(<ImprintPage />);

    const backLink = screen.getByRole("link", { name: /back to home/i });
    expect(backLink).toHaveAttribute("href", "/");
  });

  it("renders the operator block and contact email", () => {
    render(<ImprintPage />);

    expect(screen.getByText("Stefan Boos", { exact: false })).toBeInTheDocument();
    expect(screen.getByText(/Pappelweg 28/)).toBeInTheDocument();
    expect(screen.getByText(/51503 Rösrath/)).toBeInTheDocument();
    expect(screen.getByText(/webmaster@boos\.systems/)).toBeInTheDocument();
  });

  it("renders the eRecht24 source link as an external raw anchor", () => {
    render(<ImprintPage />);

    const link = screen.getByRole("link", { name: /erecht24/i });
    expect(link).toHaveAttribute("href", "https://www.e-recht24.de");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
