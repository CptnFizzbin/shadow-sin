import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { DataCardSlotSource } from "./dataCardSlot.Source.tsx"

describe("DataCardSlotSource", () => {
  it("renders its children", () => {
    render(<DataCardSlotSource source={{ book: "SR4A", page: 427 }} />, { wrapper: ThemeWrapper })

    expect(screen.getByText("SR4A p.427")).toBeDefined()
  })

  it("renders nothing when there are no children", () => {
    const { container } = render(<DataCardSlotSource source={null} />, { wrapper: ThemeWrapper })

    expect(container.firstChild).toBeNull()
  })
})
