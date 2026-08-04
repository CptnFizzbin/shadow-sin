import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { EntityCardLayoutBodyRow } from "./entityCardLayoutBodyRow.tsx"

describe("EntityCardLayoutBodyRow", () => {
  it("renders its children", () => {
    render(<EntityCardLayoutBodyRow>Body content</EntityCardLayoutBodyRow>, { wrapper: ThemeWrapper })

    expect(screen.getByText("Body content")).toBeDefined()
  })
})
