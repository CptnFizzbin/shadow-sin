import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { EntityCardLayoutHeader } from "./entityCardLayoutHeader.tsx"

describe("EntityCardLayoutHeader", () => {
  it("renders its children", () => {
    render(<EntityCardLayoutHeader>Ares Predator V</EntityCardLayoutHeader>, { wrapper: ThemeWrapper })

    expect(screen.getByText("Ares Predator V")).toBeDefined()
  })
})
