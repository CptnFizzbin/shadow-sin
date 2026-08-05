import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/system/attributeKey.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementEffects } from "./cardElementEffects.tsx"

describe("CardElementEffects", () => {
  it("renders a chip per effect", () => {
    render(
      <CardElementEffects
        effects={[{ type: GameEffectType.attrMod, target: AttributeKey.body, value: 2 }]}
      />,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("Attribute Modifier → BOD +2")).toBeDefined()
  })

  it("renders nothing when there are no effects", () => {
    const { container } = render(<CardElementEffects effects={[]} />, { wrapper: ThemeWrapper })

    expect(container.firstChild).toBeNull()
  })

  it("renders nothing when effects is undefined", () => {
    const { container } = render(<CardElementEffects effects={undefined} />, { wrapper: ThemeWrapper })

    expect(container.firstChild).toBeNull()
  })
})
