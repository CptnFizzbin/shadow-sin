import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/system/attributeKey.ts"
import { MetatypeType } from "#/system/metatypeData.ts"

import { AiAttrFormulas } from "./aiAttrFormulas.ts"

// RAW's own worked example (Unwired p.167): Corvus has CHA 2, INT 5, LOG 4, WIL 3.
describe("AiAttrFormulas.getRating", () => {
  it("is ceil(avg(Charisma, Intuition, Logic, Willpower))", () => {
    expect(AiAttrFormulas.getRating({
      charisma: 2,
      intuition: 5,
      logic: 4,
      willpower: 3,
    })).toBe(4)
  })
})

describe("AiAttrFormulas.getSystem", () => {
  it("is ceil(avg(Intuition, Logic))", () => {
    expect(AiAttrFormulas.getSystem({ intuition: 5, logic: 4 })).toBe(5)
  })
})

describe("AiAttrFormulas.getFirewall", () => {
  it("is ceil(avg(Willpower, Charisma))", () => {
    expect(AiAttrFormulas.getFirewall({ willpower: 3, charisma: 2 })).toBe(3)
  })
})

describe("AiAttrFormulas.getRatingFromAttributes", () => {
  it("pulls Charisma/Intuition/Logic/Willpower out of a catalog", () => {
    const attributes = {
      [AttributeKey.charisma]: 2,
      [AttributeKey.intuition]: 5,
      [AttributeKey.logic]: 4,
      [AttributeKey.willpower]: 3,
    }

    expect(AiAttrFormulas.getRatingFromAttributes(attributes)).toBe(4)
  })

  it("defaults any unset Mental attribute to 0", () => {
    expect(AiAttrFormulas.getRatingFromAttributes({})).toBe(0)
  })
})

describe("AiAttrFormulas.getEdgeMaxOverride", () => {
  const corvusAttributes = {
    [AttributeKey.charisma]: 2,
    [AttributeKey.intuition]: 5,
    [AttributeKey.logic]: 4,
    [AttributeKey.willpower]: 3,
  }

  it("returns the computed Rating for AI's Edge", () => {
    expect(AiAttrFormulas.getEdgeMaxOverride(AttributeKey.edge, MetatypeType.AI, corvusAttributes)).toBe(4)
  })

  it("returns undefined for a non-Edge attribute, even for AI", () => {
    expect(AiAttrFormulas.getEdgeMaxOverride(AttributeKey.charisma, MetatypeType.AI, corvusAttributes)).toBeUndefined()
  })

  it("returns undefined for Edge on a non-AI metatype", () => {
    expect(AiAttrFormulas.getEdgeMaxOverride(AttributeKey.edge, MetatypeType.Human, corvusAttributes)).toBeUndefined()
  })
})
