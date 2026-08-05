import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementAvailability } from "./cardElementAvailability.tsx"

describe("CardElementAvailability", () => {
  it("renders the availability rating", () => {
    render(<CardElementAvailability value={{ rating: 8, restricted: true }} />, { wrapper: ThemeWrapper })

    expect(screen.getByText("Avail: 8R")).toBeDefined()
  })

  it("renders nothing when there is no value", () => {
    const { container } = render(<CardElementAvailability value={undefined} />, { wrapper: ThemeWrapper })

    expect(container.firstChild).toBeNull()
  })
})
