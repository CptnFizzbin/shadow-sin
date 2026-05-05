import { useSelector } from "@tanstack/react-store"
import { renderHook } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { CharacterSheetProvider } from "#/components/character/sheet/characterSheetProvider.tsx"
import { CharacterSheetStore } from "#/components/character/sheet/characterSheetStore.ts"
import { createDefaultCharacterSheet } from "#/components/character/sheet/createDefaultCharacterSheet.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"

import { useDamageStore } from "./useDamageStore.ts"

function makeWrapper(characterSheet: CharacterSheet): FC<PropsWithChildren> {
  const store = new CharacterSheetStore(characterSheet)
  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <CharacterSheetProvider store={store}>{children}</CharacterSheetProvider>
  )
  Wrapper.displayName = "TestWrapper"
  return Wrapper
}

function makeSheet(overrides?: (sheet: CharacterSheet) => void): CharacterSheet {
  const sheet = createDefaultCharacterSheet()
  overrides?.(sheet)
  return sheet
}

describe("useDamageStore", () => {
  it("returns default wound interval of 3 with no pain tolerance effects", () => {
    // Arrange
    const sheet = makeSheet()

    // Act
    const { result } = renderHook(
      () => {
        const store = useDamageStore()
        return {
          physicalInterval: useSelector(store, (s) => s.physical.woundInterval),
          stunInterval: useSelector(store, (s) => s.stun.woundInterval),
        }
      },
      { wrapper: makeWrapper(sheet) },
    )

    // Assert
    expect(result.current.physicalInterval).toBe(3)
    expect(result.current.stunInterval).toBe(3)
  })

  it("returns wound interval of 2 for physical with Low Pain Tolerance (-1)", () => {
    // Arrange
    const sheet = makeSheet((s) => {
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
    const { result } = renderHook(
      () => {
        const store = useDamageStore()
        return {
          physicalInterval: useSelector(store, (s) => s.physical.woundInterval),
          stunInterval: useSelector(store, (s) => s.stun.woundInterval),
        }
      },
      { wrapper: makeWrapper(sheet) },
    )

    // Assert
    expect(result.current.physicalInterval).toBe(2)
    expect(result.current.stunInterval).toBe(3)
  })

  it("does not change the wound interval with High Pain Tolerance", () => {
    // Arrange
    const sheet = makeSheet((s) => {
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
    const { result } = renderHook(
      () => {
        const store = useDamageStore()
        return {
          physicalInterval: useSelector(store, (s) => s.physical.woundInterval),
          stunInterval: useSelector(store, (s) => s.stun.woundInterval),
        }
      },
      { wrapper: makeWrapper(sheet) },
    )

    // Assert
    expect(result.current.physicalInterval).toBe(3)
    expect(result.current.stunInterval).toBe(3)
  })

  it("does not change the wound interval for either track when High Pain Tolerance targets 'all'", () => {
    // Arrange
    const sheet = makeSheet((s) => {
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
    const { result } = renderHook(
      () => {
        const store = useDamageStore()
        return {
          physicalInterval: useSelector(store, (s) => s.physical.woundInterval),
          stunInterval: useSelector(store, (s) => s.stun.woundInterval),
        }
      },
      { wrapper: makeWrapper(sheet) },
    )

    // Assert
    expect(result.current.physicalInterval).toBe(3)
    expect(result.current.stunInterval).toBe(3)
  })

  it("clamps wound interval to a minimum of 1 for extreme negative pain tolerance", () => {
    // Arrange
    const sheet = makeSheet((s) => {
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
    })

    // Act
    const { result } = renderHook(
      () => {
        const store = useDamageStore()
        return useSelector(store, (s) => s.physical.woundInterval)
      },
      { wrapper: makeWrapper(sheet) },
    )

    // Assert
    expect(result.current).toBe(1)
  })

  it("computes physical max from body attribute", () => {
    // Arrange
    const sheet = makeSheet((s) => {
      s.attributes[AttributeKey.body] = 4
    })

    // Act — 8 + ceil(4/2) = 10
    const { result } = renderHook(
      () => {
        const store = useDamageStore()
        return useSelector(store, (s) => s.physical.max)
      },
      { wrapper: makeWrapper(sheet) },
    )

    // Assert
    expect(result.current).toBe(10)
  })

  it("computes stun max from willpower attribute", () => {
    // Arrange
    const sheet = makeSheet((s) => {
      s.attributes[AttributeKey.willpower] = 6
    })

    // Act — 8 + ceil(6/2) = 11
    const { result } = renderHook(
      () => {
        const store = useDamageStore()
        return useSelector(store, (s) => s.stun.max)
      },
      { wrapper: makeWrapper(sheet) },
    )

    // Assert
    expect(result.current).toBe(11)
  })

  it("reflects current damage values", () => {
    // Arrange
    const sheet = makeSheet((s) => {
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
      { wrapper: makeWrapper(sheet) },
    )

    // Assert
    expect(result.current.physicalCurrent).toBe(5)
    expect(result.current.stunCurrent).toBe(2)
  })
})
