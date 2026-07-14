import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { Prototype } from "./prototype.tsx"

describe("Prototype", () => {
  it("shows the first item's content and tab titles for every item", () => {
    render(
      <Prototype>
        <Prototype.Item title="Example 1">
          <div>Content one</div>
        </Prototype.Item>
        <Prototype.Item title="Example 2">
          <div>Content two</div>
        </Prototype.Item>
      </Prototype>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByRole("tab", { name: "Example 1" })).toBeDefined()
    expect(screen.getByRole("tab", { name: "Example 2" })).toBeDefined()
    expect(screen.getByText("Content one")).toBeDefined()
    expect(screen.queryByText("Content two")).toBeNull()
  })

  it("switches the displayed content when a different tab is selected", () => {
    render(
      <Prototype>
        <Prototype.Item title="Example 1">
          <div>Content one</div>
        </Prototype.Item>
        <Prototype.Item title="Example 2">
          <div>Content two</div>
        </Prototype.Item>
      </Prototype>,
      { wrapper: ThemeWrapper },
    )

    fireEvent.click(screen.getByRole("tab", { name: "Example 2" }))

    expect(screen.getByText("Content two")).toBeDefined()
    expect(screen.queryByText("Content one")).toBeNull()
  })
})
