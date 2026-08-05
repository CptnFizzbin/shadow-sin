import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementFooter } from "./cardElementFooter.tsx"

describe("CardElementFooter", () => {
  it("renders its children", () => {
    render(<CardElementFooter><span>500¥</span></CardElementFooter>, { wrapper: ThemeWrapper })

    expect(screen.getByText("500¥")).toBeDefined()
  })
})
