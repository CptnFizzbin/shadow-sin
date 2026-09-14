import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementAmmo } from "./cardElementAmmo.tsx"

describe("CardElementAmmo", () => {
  it("renders nothing when value is undefined", () => {
    // Arrange / Act
    const { container } = render(<CardElementAmmo value={undefined} />, { wrapper: ThemeWrapper })

    // Assert
    expect(container.firstChild).toBeNull()
  })

  it("renders remaining/size", () => {
    // Arrange / Act
    render(<CardElementAmmo value={{ remaining: 12, size: 15, type: "clip" }} />, { wrapper: ThemeWrapper })

    // Assert
    expect(screen.getByText("Ammo: 12/15")).toBeDefined()
  })

  it("renders zero remaining ammo", () => {
    // Arrange / Act
    render(<CardElementAmmo value={{ remaining: 0, size: 15, type: "clip" }} />, { wrapper: ThemeWrapper })

    // Assert
    expect(screen.getByText("Ammo: 0/15")).toBeDefined()
  })
})
