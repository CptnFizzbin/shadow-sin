import { describe, expect, it } from "vitest"

import { metatypes, MetatypeType } from "#data/biology/metatypeData.ts"
import { awakenings, AwakeningType } from "#data/magic/awakeningType.ts"
import { runnerDataFactory } from "#data/runner/runnerData.factory.ts"

import { getAttributesValues } from "./getAttributesValues.ts"

describe.concurrent("getAttributesValues", () => {
  it("matches the attributes of a new Runner for a Mundane Human", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const attributes = getAttributesValues(
      metatypes[runner.biology.metatype],
      awakenings[runner.biology.awakening],
    )

    // Assert
    expect(runner.biology.metatype).toBe(MetatypeType.Human)
    expect(runner.biology.awakening).toBe(AwakeningType.Mundane)
    expect(runner.attributes).toEqual(attributes)
  })
})
