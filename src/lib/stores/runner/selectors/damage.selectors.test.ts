import { describe, expect, it } from "vitest"

import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { selectDamageTrackFacets, selectWoundMod } from "./damage.selectors.ts"

describe("selectDamageTrackFacets", () => {
  it("reads a damage track's current value", () => {
    // Arrange
    const sheet = runnerDataFactory((s) => {
      s.damage.physical = 3
      return s
    })

    // Act
    const facets = selectDamageTrackFacets(sheet, DamageTrackKey.physical)

    // Assert
    expect(facets.current).toBe(3)
  })
})

describe("selectWoundMod", () => {
  it("sums the physical and stun wound modifiers", () => {
    // Arrange
    const sheet = runnerDataFactory((s) => {
      s.damage.physical = 3
      s.damage.stun = 3
      return s
    })

    // Act
    const woundMod = selectWoundMod(sheet)

    // Assert — floor(3/3) + floor(3/3) = 2
    expect(woundMod).toBe(2)
  })
})
