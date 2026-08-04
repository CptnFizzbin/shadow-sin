import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementBody } from "./cardElementBody.tsx"

describe("CardElementBody", () => {
  it("renders its children", () => {
    render(<CardElementBody>Body content</CardElementBody>, { wrapper: ThemeWrapper })

    expect(screen.getByText("Body content")).toBeDefined()
  })
})
