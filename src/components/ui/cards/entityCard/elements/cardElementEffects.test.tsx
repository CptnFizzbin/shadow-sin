import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"
import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementEffects } from "./cardElementEffects.tsx"

describe("CardElementEffects", () => {
  it("renders a chip per effect", () => {
    // Arrange / Act
    const { container } = render(
      <CardElementEffects
        effects={[
          { type: GameEffectType.attrMod, target: AttributeKey.body, value: 2 },
          { type: GameEffectType.attrMod, target: AttributeKey.agility, value: -1 },
        ]}
      />,
      { wrapper: ThemeWrapper },
    )

    // Assert
    expect(container.querySelectorAll(".MuiChip-root")).toHaveLength(2)
    expect(screen.getByText("Attribute Modifier → BOD +2")).toBeDefined()
    expect(screen.getByText("Attribute Modifier → AGI -1")).toBeDefined()
  })

  it("renders nothing when there are no effects", () => {
    // Arrange / Act
    const { container } = render(<CardElementEffects effects={[]} />, { wrapper: ThemeWrapper })

    // Assert
    expect(container.firstChild).toBeNull()
  })

  it("renders nothing when effects is undefined", () => {
    // Arrange / Act
    const { container } = render(<CardElementEffects effects={undefined} />, { wrapper: ThemeWrapper })

    // Assert
    expect(container.firstChild).toBeNull()
  })
})
