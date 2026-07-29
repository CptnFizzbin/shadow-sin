import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { ItemCardSubitem } from "./itemCardSubitem.tsx"

describe("ItemCardSubitem", () => {
  it("renders the name with no stats", () => {
    render(<ItemCardSubitem name="Smartlink" />, { wrapper: ThemeWrapper })

    expect(screen.getByText("Smartlink")).toBeDefined()
  })

  it("renders up to 2 stats alongside the name", () => {
    render(
      <ItemCardSubitem
        name="Gas-Vent 3 System"
        stats={[
          { label: "RC", value: "3" },
          { label: "Rating", value: "3", type: "rating" },
        ]}
      />,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("Gas-Vent 3 System")).toBeDefined()
    expect(screen.getByText("RC: 3")).toBeDefined()
    expect(screen.getByText("Rating: 3")).toBeDefined()
  })

  it("does not enforce the 2-stat convention", () => {
    render(
      <ItemCardSubitem
        name="Overloaded Mod"
        stats={[
          { label: "A", value: "1" },
          { label: "B", value: "2" },
          { label: "C", value: "3" },
        ]}
      />,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("A: 1")).toBeDefined()
    expect(screen.getByText("B: 2")).toBeDefined()
    expect(screen.getByText("C: 3")).toBeDefined()
  })
})
