import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/system/attributeKey.ts"
import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementAttributeBlock } from "./cardElementAttributeBlock.tsx"

const values: Record<AttributeKey, number> = {
  body: 3, agility: 4, reaction: 5, strength: 2,
  charisma: 0, intuition: 3, logic: 0, willpower: 0,
  edge: 0, essence: 0, magic: 6, resonance: 0,
}

describe("CardElementAttributeBlock", () => {
  it("renders a row per group, in group order", () => {
    // Arrange / Act
    const { container } = render(
      <CardElementAttributeBlock
        values={values}
        groups={[
          [AttributeKey.body, AttributeKey.agility, AttributeKey.reaction, AttributeKey.strength],
          [AttributeKey.magic],
        ]}
      />,
      { wrapper: ThemeWrapper },
    )

    // Assert
    expect(screen.getByText("3")).toBeDefined()
    expect(screen.getByText("6")).toBeDefined()
    const text = container.textContent ?? ""
    expect(text.indexOf("STR")).toBeLessThan(text.indexOf("MAG"))
  })

  it("omits zero-valued attributes within a group", () => {
    // Arrange / Act
    render(
      <CardElementAttributeBlock values={values} groups={[[AttributeKey.charisma, AttributeKey.logic]]} />,
      { wrapper: ThemeWrapper },
    )

    // Assert
    expect(screen.queryByText("CHA")).toBeNull()
    expect(screen.queryByText("LOG")).toBeNull()
  })
})
