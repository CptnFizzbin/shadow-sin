import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { NullUuid } from "#/lib/uuidUtils.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import { createItem, createItemMap } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { makeRunnerData, makeRunnerDataWrapper } from "#testUtils/renderUtils.tsx"

import { useWoundModifier } from "./useWoundModifier.ts"

describe("useWoundModifier", () => {
  it("returns 0 when there is no damage", () => {
    // Arrange
    const sheet = makeRunnerData()

    // Act
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeRunnerDataWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(0)
  })

  it("computes the default wound modifier at every 3 boxes", () => {
    // Arrange — 3 physical + 3 stun → floor(3/3) + floor(3/3) = 2
    const sheet = makeRunnerData((s) => {
      s.damage.physical = 3
      s.damage.stun = 3
    })

    // Act
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeRunnerDataWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(2)
  })

  it("applies 2 boxes per wound step with Low Pain Tolerance (-1) on physical", () => {
    // Arrange — 4 physical damage, interval 2 → floor(4/2) = 2 wound steps
    const sheet = makeRunnerData((s) => {
      s.damage.physical = 4
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
    })

    // Act
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeRunnerDataWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(2)
  })

  it("offsets damage by HPT rating before dividing (stun, rating 1)", () => {
    // Arrange — 4 stun damage, HPT rating 1 → floor((4-1)/3) = floor(1) = 1 wound step
    const sheet = makeRunnerData((s) => {
      s.damage.stun = 4
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
    })

    // Act
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeRunnerDataWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(1)
  })

  it("applies HPT offset to both tracks when target is 'all'", () => {
    // Arrange — 4 physical + 4 stun, HPT rating 1 'all' → floor(3/3) + floor(3/3) = 2
    const sheet = makeRunnerData((s) => {
      s.damage.physical = 4
      s.damage.stun = 4
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
    })

    // Act
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeRunnerDataWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(2)
  })

  it("counts HPT offset from equipped gear", () => {
    // Arrange — 6 physical damage, HPT rating 1 from gear → floor((6-1)/3) = floor(5/3) = 1
    const [painBlocker] = createItem({
      name: "Pain Editor",
      itemType: ItemType.implant,
      equipped: true,
      effects: [
        { type: GameEffectType.highPainTolerance, target: DamageTrackKey.physical, value: 1 },
      ],
    })
    const sheet = makeRunnerData((s) => {
      s.damage.physical = 6
      s.gear = createItemMap([painBlocker])
    })

    // Act
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeRunnerDataWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(1)
  })

  it("does not count HPT offset from unequipped gear", () => {
    // Arrange — 6 physical damage, gear not equipped → floor(6/3) = 2
    const [painBlocker] = createItem({
      name: "Pain Editor",
      itemType: ItemType.implant,
      equipped: false,
      effects: [
        { type: GameEffectType.highPainTolerance, target: DamageTrackKey.physical, value: 1 },
      ],
    })
    const sheet = makeRunnerData((s) => {
      s.damage.physical = 6
      s.gear = createItemMap([painBlocker])
    })

    // Act
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeRunnerDataWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(2)
  })

  it("accumulates HPT offsets from multiple sources", () => {
    // Arrange — HPT +1 quality + HPT +1 gear = offset 2; 5 physical → floor((5-2)/3) = floor(1) = 1
    const [painBlocker] = createItem({
      name: "Pain Editor",
      itemType: ItemType.implant,
      effects: [
        { type: GameEffectType.highPainTolerance, target: DamageTrackKey.physical, value: 1 },
      ],
    })
    const sheet = makeRunnerData((s) => {
      s.damage.physical = 5
      s.qualities = [
        {
          id: NullUuid,
          name: "High Pain Tolerance",
          type: "positive",
          effects: [
            { type: GameEffectType.highPainTolerance, target: DamageTrackKey.physical, value: 1 },
          ],
        },
      ]
      s.gear = createItemMap([painBlocker])
    })

    // Act
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeRunnerDataWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(1)
  })

  // Diverging cases that prove the offset model differs from the old interval model

  it("HPT rating 6, 7 physical boxes → wound mod 0 (floor(max(0,7-6)/3) = 0)", () => {
    // Arrange
    const sheet = makeRunnerData((s) => {
      s.damage.physical = 7
      s.qualities = [
        {
          id: NullUuid,
          name: "High Pain Tolerance",
          type: "positive",
          effects: [
            { type: GameEffectType.highPainTolerance, target: DamageTrackKey.physical, value: 6 },
          ],
        },
      ]
    })

    // Act
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeRunnerDataWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(0)
  })

  it("HPT rating 3, 6 physical boxes → wound mod 1 (floor((6-3)/3) = 1, not 2)", () => {
    // Arrange
    const sheet = makeRunnerData((s) => {
      s.damage.physical = 6
      s.qualities = [
        {
          id: NullUuid,
          name: "High Pain Tolerance",
          type: "positive",
          effects: [
            { type: GameEffectType.highPainTolerance, target: DamageTrackKey.physical, value: 3 },
          ],
        },
      ]
    })

    // Act
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeRunnerDataWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(1)
  })

  it("HPT rating 3, 3 physical boxes → wound mod 0 (offset consumes all damage)", () => {
    // Arrange
    const sheet = makeRunnerData((s) => {
      s.damage.physical = 3
      s.qualities = [
        {
          id: NullUuid,
          name: "High Pain Tolerance",
          type: "positive",
          effects: [
            { type: GameEffectType.highPainTolerance, target: DamageTrackKey.physical, value: 3 },
          ],
        },
      ]
    })

    // Act
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeRunnerDataWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(0)
  })

  it("HPT rating 1, 7 physical boxes → wound mod 2 (floor((7-1)/3) = 2)", () => {
    // Arrange
    const sheet = makeRunnerData((s) => {
      s.damage.physical = 7
      s.qualities = [
        {
          id: NullUuid,
          name: "High Pain Tolerance",
          type: "positive",
          effects: [
            { type: GameEffectType.highPainTolerance, target: DamageTrackKey.physical, value: 1 },
          ],
        },
      ]
    })

    // Act
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeRunnerDataWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(2)
  })

  it("HPT physical track only — stun damage is unchanged (HPT target=physical, 4 stun → floor(4/3) = 1)", () => {
    // Arrange
    const sheet = makeRunnerData((s) => {
      s.damage.stun = 4
      s.qualities = [
        {
          id: NullUuid,
          name: "High Pain Tolerance",
          type: "positive",
          effects: [
            { type: GameEffectType.highPainTolerance, target: DamageTrackKey.physical, value: 3 },
          ],
        },
      ]
    })

    // Act
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeRunnerDataWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(1)
  })

  it("LPT, 2 physical boxes → wound mod 1 (floor(2/2) = 1, interval = 2)", () => {
    // Arrange
    const sheet = makeRunnerData((s) => {
      s.damage.physical = 2
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
    })

    // Act
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeRunnerDataWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(1)
  })

  it("LPT, 4 physical boxes → wound mod 2 (floor(4/2) = 2)", () => {
    // Arrange
    const sheet = makeRunnerData((s) => {
      s.damage.physical = 4
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
    })

    // Act
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeRunnerDataWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(2)
  })

  it("HPT 2 + LPT on same track, 8 physical → wound mod 3 (floor((8-2)/2) = 3)", () => {
    // Arrange
    const sheet = makeRunnerData((s) => {
      s.damage.physical = 8
      s.qualities = [
        {
          id: NullUuid,
          name: "High Pain Tolerance",
          type: "positive",
          effects: [
            { type: GameEffectType.highPainTolerance, target: DamageTrackKey.physical, value: 2 },
          ],
        },
        {
          id: NullUuid,
          name: "Low Pain Tolerance",
          type: "negative",
          effects: [
            { type: GameEffectType.lowPainTolerance, target: DamageTrackKey.physical, value: -1 },
          ],
        },
      ]
    })

    // Act
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeRunnerDataWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(3)
  })
})
