import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardLayoutBodyRow } from "./cardLayoutBodyRow.tsx"

describe("Card.Layout.BodyRow", () => {
  it("renders its children", () => {
    render(<CardLayoutBodyRow>Body content</CardLayoutBodyRow>, { wrapper: ThemeWrapper })

    expect(screen.getByText("Body content")).toBeDefined()
  })
})
