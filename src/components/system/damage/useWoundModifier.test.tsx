import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { NullUuid } from "#/lib/uuidUtils.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import { createItem, createItemMap } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import type { QualityData } from "#/system/qualityData.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { makeRunnerDataWrapper } from "#testUtils/renderUtils.tsx"

import { useWoundModifier } from "./useWoundModifier.ts"

function highPainTolerance(target: DamageTrackKey | "all", value: number): QualityData {
  return {
    id: NullUuid,
    name: "High Pain Tolerance",
    type: "positive",
    effects: [{ type: GameEffectType.highPainTolerance, target, value }],
  }
}

function lowPainTolerance(target: DamageTrackKey | "all", value: number): QualityData {
  return {
    id: NullUuid,
    name: "Low Pain Tolerance",
    type: "negative",
    effects: [{ type: GameEffectType.lowPainTolerance, target, value }],
  }
}

function painEditor(equipped: boolean) {
  const [item] = createItem({
    name: "Pain Editor",
    itemType: ItemType.implant,
    equipped,
    effects: [{ type: GameEffectType.highPainTolerance, target: DamageTrackKey.physical, value: 1 }],
  })
  return item
}

function expectWoundModifier(mutate: (s: RunnerData) => RunnerData, expected: number) {
  const sheet = runnerDataFactory(mutate)

  const { result } = renderHook(() => useWoundModifier(), {
    wrapper: makeRunnerDataWrapper(sheet),
  })

  expect(result.current).toBe(expected)
}

describe("useWoundModifier", () => {
  it("returns 0 when there is no damage", () => {
    expectWoundModifier((s) => s, 0)
  })

  it("computes the default wound modifier at every 3 boxes", () => {
    // 3 physical + 3 stun → floor(3/3) + floor(3/3) = 2
    expectWoundModifier((s) => {
      s.damage.physical = 3
      s.damage.stun = 3
      return s
    }, 2)
  })

  it("applies 2 boxes per wound step with Low Pain Tolerance (-1) on physical", () => {
    // 4 physical damage, interval 2 → floor(4/2) = 2 wound steps
    expectWoundModifier((s) => {
      s.damage.physical = 4
      s.qualities = [lowPainTolerance(DamageTrackKey.physical, -1)]
      return s
    }, 2)
  })

  it("offsets damage by HPT rating before dividing (stun, rating 1)", () => {
    // 4 stun damage, HPT rating 1 → floor((4-1)/3) = floor(1) = 1 wound step
    expectWoundModifier((s) => {
      s.damage.stun = 4
      s.qualities = [highPainTolerance(DamageTrackKey.stun, 1)]
      return s
    }, 1)
  })

  it("applies HPT offset to both tracks when target is 'all'", () => {
    // 4 physical + 4 stun, HPT rating 1 'all' → floor(3/3) + floor(3/3) = 2
    expectWoundModifier((s) => {
      s.damage.physical = 4
      s.damage.stun = 4
      s.qualities = [highPainTolerance("all", 1)]
      return s
    }, 2)
  })

  it("counts HPT offset from equipped gear", () => {
    // 6 physical damage, HPT rating 1 from gear → floor((6-1)/3) = floor(5/3) = 1
    expectWoundModifier((s) => {
      s.damage.physical = 6
      s.gear = createItemMap([painEditor(true)])
      return s
    }, 1)
  })

  it("does not count HPT offset from unequipped gear", () => {
    // 6 physical damage, gear not equipped → floor(6/3) = 2
    expectWoundModifier((s) => {
      s.damage.physical = 6
      s.gear = createItemMap([painEditor(false)])
      return s
    }, 2)
  })

  it("accumulates HPT offsets from multiple sources", () => {
    // HPT +1 quality + HPT +1 gear = offset 2; 5 physical → floor((5-2)/3) = floor(1) = 1
    const [painBlocker] = createItem({
      name: "Pain Editor",
      itemType: ItemType.implant,
      effects: [{ type: GameEffectType.highPainTolerance, target: DamageTrackKey.physical, value: 1 }],
    })

    expectWoundModifier((s) => {
      s.damage.physical = 5
      s.qualities = [highPainTolerance(DamageTrackKey.physical, 1)]
      s.gear = createItemMap([painBlocker])
      return s
    }, 1)
  })

  // Diverging cases that prove the offset model differs from the old interval model
  it.each([
    { rating: 6, physical: 7, expected: 0, note: "floor(max(0,7-6)/3) = 0" },
    { rating: 3, physical: 6, expected: 1, note: "floor((6-3)/3) = 1, not 2" },
    { rating: 3, physical: 3, expected: 0, note: "offset consumes all damage" },
    { rating: 1, physical: 7, expected: 2, note: "floor((7-1)/3) = 2" },
  ])(
    "HPT rating $rating, $physical physical boxes → wound mod $expected ($note)",
    ({ rating, physical, expected }) => {
      expectWoundModifier((s) => {
        s.damage.physical = physical
        s.qualities = [highPainTolerance(DamageTrackKey.physical, rating)]
        return s
      }, expected)
    },
  )

  it("HPT physical track only — stun damage is unchanged (HPT target=physical, 4 stun → floor(4/3) = 1)", () => {
    expectWoundModifier((s) => {
      s.damage.stun = 4
      s.qualities = [highPainTolerance(DamageTrackKey.physical, 3)]
      return s
    }, 1)
  })

  it.each([
    { physical: 2, expected: 1, note: "floor(2/2) = 1, interval = 2" },
    { physical: 4, expected: 2, note: "floor(4/2) = 2" },
  ])("LPT, $physical physical boxes → wound mod $expected ($note)", ({ physical, expected }) => {
    expectWoundModifier((s) => {
      s.damage.physical = physical
      s.qualities = [lowPainTolerance(DamageTrackKey.physical, -1)]
      return s
    }, expected)
  })

  it("HPT 2 + LPT on same track, 8 physical → wound mod 3 (floor((8-2)/2) = 3)", () => {
    expectWoundModifier((s) => {
      s.damage.physical = 8
      s.qualities = [
        highPainTolerance(DamageTrackKey.physical, 2),
        lowPainTolerance(DamageTrackKey.physical, -1),
      ]
      return s
    }, 3)
  })
})
