import { useSelector } from "@tanstack/react-store"
import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { NullUuid } from "#/lib/uuidUtils.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import { makeCharacterSheet, makeCharacterSheetWrapper } from "#testUtils/renderUtils.tsx"

import { useDamageStore } from "./useDamageStore.ts"

describe("useDamageStore", () => {
  it("returns default wound interval of 3 with no pain tolerance effects", () => {
    // Arrange
    const sheet = makeCharacterSheet()

    // Act
    const { result } = renderHook(
      () => {
        const store = useDamageStore()
        return {
          physicalInterval: useSelector(store, (s) => s.physical.woundInterval),
          stunInterval: useSelector(store, (s) => s.stun.woundInterval),
        }
      },
      { wrapper: makeCharacterSheetWrapper(sheet) },
    )

    // Assert
    expect(result.current.physicalInterval).toBe(3)
    expect(result.current.stunInterval).toBe(3)
  })

  it("returns wound interval of 2 for physical with Low Pain Tolerance (-1)", () => {
    // Arrange
    const sheet = makeCharacterSheet((s) => {
      s.qualities = [
        {
          id: NullUuid,
          name: "Low Pain Tolerance",
          type: "negative",
          effects: [
            { type: GameEffectType.painTolerance, target: DamageTrackKey.physical, value: -1 },
          ],
        },
      ]
    })

    // Act
    const { result } = renderHook(
      () => {
        const store = useDamageStore()
        return {
          physicalInterval: useSelector(store, (s) => s.physical.woundInterval),
          stunInterval: useSelector(store, (s) => s.stun.woundInterval),
        }
      },
      { wrapper: makeCharacterSheetWrapper(sheet) },
    )

    // Assert
    expect(result.current.physicalInterval).toBe(2)
    expect(result.current.stunInterval).toBe(3)
  })

  it("returns wound interval of 4 for stun with High Pain Tolerance (+1)", () => {
    // Arrange
    const sheet = makeCharacterSheet((s) => {
      s.qualities = [
        {
          id: NullUuid,
          name: "High Pain Tolerance",
          type: "positive",
          effects: [
            { type: GameEffectType.painTolerance, target: DamageTrackKey.stun, value: 1 },
          ],
        },
      ]
    })

    // Act
    const { result } = renderHook(
      () => {
        const store = useDamageStore()
        return {
          physicalInterval: useSelector(store, (s) => s.physical.woundInterval),
          stunInterval: useSelector(store, (s) => s.stun.woundInterval),
        }
      },
      { wrapper: makeCharacterSheetWrapper(sheet) },
    )

    // Assert
    expect(result.current.physicalInterval).toBe(3)
    expect(result.current.stunInterval).toBe(4)
  })

  it("returns wound interval of 4 for both tracks with 'all' target", () => {
    // Arrange
    const sheet = makeCharacterSheet((s) => {
      s.qualities = [
        {
          id: NullUuid,
          name: "High Pain Tolerance",
          type: "positive",
          effects: [
            { type: GameEffectType.painTolerance, target: "all", value: 1 },
          ],
        },
      ]
    })

    // Act
    const { result } = renderHook(
      () => {
        const store = useDamageStore()
        return {
          physicalInterval: useSelector(store, (s) => s.physical.woundInterval),
          stunInterval: useSelector(store, (s) => s.stun.woundInterval),
        }
      },
      { wrapper: makeCharacterSheetWrapper(sheet) },
    )

    // Assert
    expect(result.current.physicalInterval).toBe(4)
    expect(result.current.stunInterval).toBe(4)
  })

  it("clamps wound interval to a minimum of 1 for extreme negative pain tolerance", () => {
    // Arrange
    const sheet = makeCharacterSheet((s) => {
      s.qualities = [
        {
          id: NullUuid,
          name: "Extreme Pain Intolerance",
          type: "negative",
          effects: [
            { type: GameEffectType.painTolerance, target: DamageTrackKey.physical, value: -10 },
          ],
        },
      ]
    })

    // Act
    const { result } = renderHook(
      () => {
        const store = useDamageStore()
        return useSelector(store, (s) => s.physical.woundInterval)
      },
      { wrapper: makeCharacterSheetWrapper(sheet) },
    )

    // Assert
    expect(result.current).toBe(1)
  })

  it("computes physical max from body attribute", () => {
    // Arrange
    const sheet = makeCharacterSheet((s) => {
      s.attributes[AttributeKey.body] = 4
    })

    // Act — 8 + ceil(4/2) = 10
    const { result } = renderHook(
      () => {
        const store = useDamageStore()
        return useSelector(store, (s) => s.physical.max)
      },
      { wrapper: makeCharacterSheetWrapper(sheet) },
    )

    // Assert
    expect(result.current).toBe(10)
  })

  it("computes stun max from willpower attribute", () => {
    // Arrange
    const sheet = makeCharacterSheet((s) => {
      s.attributes[AttributeKey.willpower] = 6
    })

    // Act — 8 + ceil(6/2) = 11
    const { result } = renderHook(
      () => {
        const store = useDamageStore()
        return useSelector(store, (s) => s.stun.max)
      },
      { wrapper: makeCharacterSheetWrapper(sheet) },
    )

    // Assert
    expect(result.current).toBe(11)
  })

  it("reflects current damage values", () => {
    // Arrange
    const sheet = makeCharacterSheet((s) => {
      s.damage.physical = 5
      s.damage.stun = 2
    })

    // Act
    const { result } = renderHook(
      () => {
        const store = useDamageStore()
        return {
          physicalCurrent: useSelector(store, (s) => s.physical.current),
          stunCurrent: useSelector(store, (s) => s.stun.current),
        }
      },
      { wrapper: makeCharacterSheetWrapper(sheet) },
    )

    // Assert
    expect(result.current.physicalCurrent).toBe(5)
    expect(result.current.stunCurrent).toBe(2)
  })
})
