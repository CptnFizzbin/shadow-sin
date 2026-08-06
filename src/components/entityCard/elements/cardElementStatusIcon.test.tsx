import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementStatusIcon } from "./cardElementStatusIcon.tsx"

describe("CardElementStatusIcon", () => {
  it.each([
    ["equipped", "Equipped"],
    ["stashed", "Stashed"],
    ["fixed", "Fixed"],
    ["wireless-enabled", "Wireless"],
    ["wireless-disabled", "Wireless off"],
    ["wireless-removed", "Wireless removed"],
  ] as const)("renders the %s icon labeled %s", (status, label) => {
    // Arrange / Act
    render(<CardElementStatusIcon status={status} />, { wrapper: ThemeWrapper })

    // Assert
    expect(screen.getByLabelText(label)).toBeDefined()
  })
})
