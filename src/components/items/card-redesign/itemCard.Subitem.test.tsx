import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { ItemCardSubitem } from "./itemCard.Subitem.tsx"

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
})
