import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { EntityCardLayoutBody } from "./entityCardLayoutBody.tsx"

describe("EntityCardLayoutBody", () => {
  it("renders its children", () => {
    render(<EntityCardLayoutBody>Body content</EntityCardLayoutBody>, { wrapper: ThemeWrapper })

    expect(screen.getByText("Body content")).toBeDefined()
  })
})
