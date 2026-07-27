import { describe, expect, it } from "vitest"

import { NullUuid } from "#/lib/uuidUtils.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { selectPhysicalTrack, selectStunTrack } from "./damageSlice.selectors.ts"

describe("selectPhysicalTrack / selectStunTrack", () => {
  it("returns default wound interval of 3 with no pain tolerance effects", () => {
    // Arrange
    const sheet = runnerDataFactory()

    // Act / Assert
    expect(selectPhysicalTrack(sheet).woundInterval).toBe(3)
    expect(selectStunTrack(sheet).woundInterval).toBe(3)
  })

  it("returns wound interval of 2 for physical with Low Pain Tolerance (-1)", () => {
    // Arrange
    const sheet = runnerDataFactory((s) => {
      s.qualities = [
        {
          id: NullUuid,
          name: "Low Pain Tolerance",
          type: "negative",
          effects: [
            { type: GameEffectType.lowPainTolerance, target: DamageTrackKey.physical, value: -1 },
          ],
        },
      ]
      return s
    })

    // Act / Assert
    expect(selectPhysicalTrack(sheet).woundInterval).toBe(2)
    expect(selectStunTrack(sheet).woundInterval).toBe(3)
  })

  it("does not change the wound interval with High Pain Tolerance", () => {
    // Arrange
    const sheet = runnerDataFactory((s) => {
      s.qualities = [
        {
          id: NullUuid,
          name: "High Pain Tolerance",
          type: "positive",
          effects: [
            { type: GameEffectType.highPainTolerance, target: DamageTrackKey.stun, value: 1 },
          ],
        },
      ]
      return s
    })

    // Act / Assert
    expect(selectPhysicalTrack(sheet).woundInterval).toBe(3)
    expect(selectStunTrack(sheet).woundInterval).toBe(3)
  })

  it("does not change the wound interval for either track when High Pain Tolerance targets 'all'", () => {
    // Arrange
    const sheet = runnerDataFactory((s) => {
      s.qualities = [
        {
          id: NullUuid,
          name: "High Pain Tolerance",
          type: "positive",
          effects: [
            { type: GameEffectType.highPainTolerance, target: "all", value: 1 },
          ],
        },
      ]
      return s
    })

    // Act / Assert
    expect(selectPhysicalTrack(sheet).woundInterval).toBe(3)
    expect(selectStunTrack(sheet).woundInterval).toBe(3)
  })

  it("clamps wound interval to a minimum of 1 for extreme negative pain tolerance", () => {
    // Arrange
    const sheet = runnerDataFactory((s) => {
      s.qualities = [
        {
          id: NullUuid,
          name: "Extreme Pain Intolerance",
          type: "negative",
          effects: [
            { type: GameEffectType.lowPainTolerance, target: DamageTrackKey.physical, value: -10 },
          ],
        },
      ]
      return s
    })

    // Act / Assert
    expect(selectPhysicalTrack(sheet).woundInterval).toBe(1)
  })

  it("computes physical max from body attribute", () => {
    // Arrange — 8 + ceil(4/2) = 10
    const sheet = runnerDataFactory((s) => {
      s.attributes[AttributeKey.body] = 4
      return s
    })

    // Act / Assert
    expect(selectPhysicalTrack(sheet).max).toBe(10)
  })

  it("computes stun max from willpower attribute", () => {
    // Arrange — 8 + ceil(6/2) = 11
    const sheet = runnerDataFactory((s) => {
      s.attributes[AttributeKey.willpower] = 6
      return s
    })

    // Act / Assert
    expect(selectStunTrack(sheet).max).toBe(11)
  })

  it("reflects current damage values", () => {
    // Arrange
    const sheet = runnerDataFactory((s) => {
      s.damage.physical = 5
      s.damage.stun = 2
      return s
    })

    // Act / Assert
    expect(selectPhysicalTrack(sheet).current).toBe(5)
    expect(selectStunTrack(sheet).current).toBe(2)
  })
})
