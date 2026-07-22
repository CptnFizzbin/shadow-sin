import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { Prototype } from "./prototype.tsx"

const versions = [
  { key: "grid", name: "grid" },
  { key: "list", name: "list" },
]

const renderPrototype = () =>
  render(
    <Prototype versions={versions}>
      <div>
        <div>
          <div>
            <Prototype.Item version="grid">
              <div>Grid content</div>
            </Prototype.Item>
            <Prototype.Item version="list">
              <div>List content</div>
            </Prototype.Item>
          </div>
        </div>
      </div>
    </Prototype>,
    { wrapper: ThemeWrapper },
  )

describe("Prototype", () => {
  it("shows the first item's content and its position/name in the switcher bar, however deeply nested", () => {
    renderPrototype()

    expect(screen.getByText("1 / 2 — grid")).toBeDefined()
    expect(screen.getByText("Grid content")).toBeDefined()
    expect(screen.queryByText("List content")).toBeNull()
  })

  it("advances to the next item when the next button is clicked", () => {
    renderPrototype()

    fireEvent.click(screen.getByRole("button", { name: "Next prototype" }))

    expect(screen.getByText("2 / 2 — list")).toBeDefined()
    expect(screen.getByText("List content")).toBeDefined()
    expect(screen.queryByText("Grid content")).toBeNull()
  })

  it("wraps around to the last item when going previous from the first item", () => {
    renderPrototype()

    fireEvent.click(screen.getByRole("button", { name: "Previous prototype" }))

    expect(screen.getByText("2 / 2 — list")).toBeDefined()
    expect(screen.getByText("List content")).toBeDefined()
  })

  it("wraps around to the first item when going next from the last item", () => {
    renderPrototype()

    fireEvent.click(screen.getByRole("button", { name: "Next prototype" }))
    fireEvent.click(screen.getByRole("button", { name: "Next prototype" }))

    expect(screen.getByText("1 / 2 — grid")).toBeDefined()
    expect(screen.getByText("Grid content")).toBeDefined()
  })

  it("groups items sharing the same version and shows/hides them together, even from a later-rendered component", () => {
    const GridFooter = () => (
      <div>
        <Prototype.Item version="grid">
          <div>Grid footer</div>
        </Prototype.Item>
        <Prototype.Item version="list">
          <div>List body</div>
        </Prototype.Item>
      </div>
    )

    render(
      <Prototype versions={versions}>
        <div>
          <Prototype.Item version="grid">
            <div>Grid header</div>
          </Prototype.Item>
        </div>
        <GridFooter />
      </Prototype>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("1 / 2 — grid")).toBeDefined()
    expect(screen.getByText("Grid header")).toBeDefined()
    expect(screen.getByText("Grid footer")).toBeDefined()
    expect(screen.queryByText("List body")).toBeNull()

    fireEvent.click(screen.getByRole("button", { name: "Next prototype" }))

    expect(screen.getByText("2 / 2 — list")).toBeDefined()
    expect(screen.getByText("List body")).toBeDefined()
    expect(screen.queryByText("Grid header")).toBeNull()
    expect(screen.queryByText("Grid footer")).toBeNull()
  })
})
