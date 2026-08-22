import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/system/attributeKey.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { AttrSelectors, selectAttrBase, selectAttributes, selectAttrValue } from "./attributesSlice.selectors.ts"

/** `AttrSelectors`' `TState` — `{ entity: EntityBase & EntityWithAttrs }` — is what
 *  `useRunnerSelector` assembles from a `RunnerData` alone (see `mapToLegacySelector.ts`); a
 *  `RunnerData` structurally satisfies both traits, so tests assemble it the same way. */
const stateFor = (runner: RunnerData) => ({ entity: runner })

describe("selectAttributes", () => {
  it("returns the runner's attributes record", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(selectAttributes(runner)).toBe(runner.attributes)
  })
})

describe("selectAttrBase", () => {
  it("returns the stored value for the given key", () => {
    // Arrange
    const runner = runnerDataFactory((s) => {
      s.attributes[AttributeKey.body] = 5
      return s
    })

    // Act / Assert
    expect(selectAttrBase(AttributeKey.body)(runner)).toBe(5)
  })

  it("returns 0 when the key is unset", () => {
    // Arrange
    const runner = runnerDataFactory((s) => {
      delete s.attributes[AttributeKey.magic]
      return s
    })

    // Act / Assert
    expect(selectAttrBase(AttributeKey.magic)(runner)).toBe(0)
  })
})

describe("selectAttrValue", () => {
  it("matches the base value (no derived modifiers applied yet)", () => {
    // Arrange
    const runner = runnerDataFactory((s) => {
      s.attributes[AttributeKey.willpower] = 4
      return s
    })

    // Act / Assert
    expect(selectAttrValue(AttributeKey.willpower)(runner)).toBe(4)
  })
})

describe("AttrSelectors.selectAll", () => {
  it("returns the entity's attributes record", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(AttrSelectors.selectAll(stateFor(runner))).toBe(runner.attributes)
  })
})

describe("AttrSelectors.selectBase", () => {
  it("returns the stored value for the given key", () => {
    // Arrange
    const runner = runnerDataFactory((s) => {
      s.attributes[AttributeKey.agility] = 6
      return s
    })

    // Act / Assert
    expect(AttrSelectors.selectBase(stateFor(runner), { key: AttributeKey.agility })).toBe(6)
  })

  it("returns 0 when the key is unset", () => {
    // Arrange
    const runner = runnerDataFactory((s) => {
      delete s.attributes[AttributeKey.resonance]
      return s
    })

    // Act / Assert
    expect(AttrSelectors.selectBase(stateFor(runner), { key: AttributeKey.resonance })).toBe(0)
  })
})

describe("AttrSelectors.selectValue", () => {
  it("matches selectBase (no derived modifiers applied yet)", () => {
    // Arrange
    const runner = runnerDataFactory((s) => {
      s.attributes[AttributeKey.logic] = 3
      return s
    })

    // Act / Assert
    expect(AttrSelectors.selectValue(stateFor(runner), { key: AttributeKey.logic })).toBe(3)
  })
})

describe("AttrSelectors.forAttr", () => {
  it("pins selectBase to the given attribute, needing no options", () => {
    // Arrange
    const runner = runnerDataFactory((s) => {
      s.attributes[AttributeKey.strength] = 5
      return s
    })

    // Act / Assert
    expect(AttrSelectors.forAttr(AttributeKey.strength).selectBase(stateFor(runner))).toBe(5)
  })

  it("pins selectValue to the given attribute, needing no options", () => {
    // Arrange
    const runner = runnerDataFactory((s) => {
      s.attributes[AttributeKey.charisma] = 7
      return s
    })

    // Act / Assert
    expect(AttrSelectors.forAttr(AttributeKey.charisma).selectValue(stateFor(runner))).toBe(7)
  })

  it("doesn't leak values between attributes", () => {
    // Arrange
    const runner = runnerDataFactory((s) => {
      s.attributes[AttributeKey.body] = 2
      s.attributes[AttributeKey.reaction] = 9
      return s
    })

    // Act / Assert
    expect(AttrSelectors.forAttr(AttributeKey.body).selectBase(stateFor(runner))).toBe(2)
    expect(AttrSelectors.forAttr(AttributeKey.reaction).selectBase(stateFor(runner))).toBe(9)
  })
})
