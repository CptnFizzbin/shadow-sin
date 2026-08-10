import { describe, expect, it } from "vitest"

import type { AttributesContextValue } from "#/lib/contexts/runner/attributesProvider.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"

import { selectAttributeFacets } from "./attribute.selectors.ts"

describe("selectAttributeFacets", () => {
  it("reads the base value and info for a set attribute", () => {
    // Arrange
    const context: AttributesContextValue = {
      values: { [AttributeKey.body]: 5 },
      infos: { [AttributeKey.body]: { min: 1, max: 6 } } as AttributesContextValue["infos"],
    }

    // Act
    const facets = selectAttributeFacets(context, AttributeKey.body)

    // Assert
    expect(facets).toEqual({ baseValue: 5, info: { min: 1, max: 6 } })
  })

  it("defaults an unset attribute's base value to 0", () => {
    // Arrange
    const context: AttributesContextValue = {
      values: {},
      infos: { [AttributeKey.system]: { min: 0, max: 0 } } as AttributesContextValue["infos"],
    }

    // Act
    const facets = selectAttributeFacets(context, AttributeKey.system)

    // Assert
    expect(facets.baseValue).toBe(0)
  })
})
