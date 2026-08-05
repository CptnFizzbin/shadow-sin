import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { BodyRow } from "./bodyRow.tsx"

describe("EntityCardLayoutBodyRow", () => {
  it("renders its children", () => {
    render(<BodyRow>Body content</BodyRow>, { wrapper: ThemeWrapper })

    expect(screen.getByText("Body content")).toBeDefined()
  })
})
