import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementTitle } from "./cardElementTitle.tsx"

describe("CardElementTitle", () => {
  it("renders the title", () => {
    render(<CardElementTitle title="Ares Predator V" />, { wrapper: ThemeWrapper })

    expect(screen.getByText("Ares Predator V")).toBeDefined()
  })
})
