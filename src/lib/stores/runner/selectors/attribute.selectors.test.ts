import { describe, expect, it } from "vitest"

import type { AttributesContextValue } from "#/lib/contexts/runner/attributesProvider.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"

import { selectAllAttrs, selectAttr } from "./attribute.selectors.ts"

const makeContext = (overrides?: Partial<AttributesContextValue>): AttributesContextValue => ({
  values: { [AttributeKey.body]: 4 },
  infos: {
    [AttributeKey.body]: { min: 1, max: 6, augMax: 7 },
  } as AttributesContextValue["infos"],
  ...overrides,
})

describe("selectAllAttrs", () => {
  it("derives min/max/augMax from infos and baseValue/value from values", () => {
    // Arrange
    const context = makeContext()

    // Act
    const attrs = selectAllAttrs(context)

    // Assert
    expect(attrs[AttributeKey.body]).toEqual({
      min: 1,
      max: 6,
      augMax: 7,
      baseValue: 4,
      value: 4,
    })
  })

  it("falls back augMax to max when unset", () => {
    // Arrange
    const context = makeContext({
      infos: { [AttributeKey.body]: { min: 1, max: 6 } } as AttributesContextValue["infos"],
    })

    // Act
    const attrs = selectAllAttrs(context)

    // Assert
    expect(attrs[AttributeKey.body].augMax).toBe(6)
  })

  it("defaults an unset stored value to 0", () => {
    // Arrange
    const context = makeContext({ values: {} })

    // Act
    const attrs = selectAllAttrs(context)

    // Assert
    expect(attrs[AttributeKey.body].baseValue).toBe(0)
    expect(attrs[AttributeKey.body].value).toBe(0)
  })
})

describe("selectAttr", () => {
  it("returns the facets for a single attribute", () => {
    // Arrange
    const context = makeContext()

    // Act
    const facets = selectAttr(context, AttributeKey.body)

    // Assert
    expect(facets).toEqual({ min: 1, max: 6, augMax: 7, baseValue: 4, value: 4 })
  })
})
