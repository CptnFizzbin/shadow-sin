import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { Prototype } from "./prototype.tsx"

const renderPrototype = () =>
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

describe("Prototype", () => {
  it("shows the first item's content and its position/title in the switcher bar", () => {
    renderPrototype()

    expect(screen.getByText("1 / 2 — Example 1")).toBeDefined()
    expect(screen.getByText("Content one")).toBeDefined()
    expect(screen.queryByText("Content two")).toBeNull()
  })

  it("advances to the next item when the next button is clicked", () => {
    renderPrototype()

    fireEvent.click(screen.getByRole("button", { name: "Next prototype" }))

    expect(screen.getByText("2 / 2 — Example 2")).toBeDefined()
    expect(screen.getByText("Content two")).toBeDefined()
    expect(screen.queryByText("Content one")).toBeNull()
  })

  it("wraps around to the last item when going previous from the first item", () => {
    renderPrototype()

    fireEvent.click(screen.getByRole("button", { name: "Previous prototype" }))

    expect(screen.getByText("2 / 2 — Example 2")).toBeDefined()
    expect(screen.getByText("Content two")).toBeDefined()
  })

  it("wraps around to the first item when going next from the last item", () => {
    renderPrototype()

    fireEvent.click(screen.getByRole("button", { name: "Next prototype" }))
    fireEvent.click(screen.getByRole("button", { name: "Next prototype" }))

    expect(screen.getByText("1 / 2 — Example 1")).toBeDefined()
    expect(screen.getByText("Content one")).toBeDefined()
  })
})
