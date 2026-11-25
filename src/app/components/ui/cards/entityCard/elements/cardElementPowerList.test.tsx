import Chip from "@mui/material/Chip"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementPowerList } from "./cardElementPowerList.tsx"

describe("CardElementPowerList", () => {
  it("renders a default 'Powers' label with its children", () => {
    // Arrange / Act
    render(
      <CardElementPowerList>
        <Chip label="Astral Form" />
      </CardElementPowerList>,
      { wrapper: ThemeWrapper },
    )

    // Assert
    expect(screen.getByText("Powers")).toBeDefined()
    expect(screen.getByText("Astral Form")).toBeDefined()
  })

  it("renders a custom label", () => {
    // Arrange / Act
    render(
      <CardElementPowerList label="Optional Powers">
        <Chip label="Fear" />
      </CardElementPowerList>,
      { wrapper: ThemeWrapper },
    )

    // Assert
    expect(screen.getByText("Optional Powers")).toBeDefined()
  })
})
