import { renderHook } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { CharacterSheetProvider } from "#/components/character/characterSheetProvider.tsx"
import { CharacterSheetStore } from "#/components/character/characterSheetStore.ts"
import { createDefaultCharacterSheet } from "#/components/character/createDefaultCharacterSheet.ts"
import { useWoundModifier } from "#/components/damage/useWoundModifier.ts"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"
import { DamageTrackKey } from "#/lib/system/damageTrackKey.ts"
import { GameEffectType } from "#/lib/system/gameEffects/gameEffectType.ts"
import { createItem, createItemMap } from "#/lib/system/itemData.ts"
import { ItemType } from "#/lib/system/itemType.ts"

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

describe("useWoundModifier", () => {
  it("returns 0 when there is no damage", () => {
    // Arrange
    const sheet = makeSheet()

    // Act
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(0)
  })

  it("computes the default wound modifier at every 3 boxes", () => {
    // Arrange — 3 physical + 3 stun → floor(3/3) + floor(3/3) = 2
    const sheet = makeSheet((s) => {
      s.damage.physical = 3
      s.damage.stun = 3
    })

    // Act
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(2)
  })

  it("applies 2 boxes per wound step with Low Pain Tolerance (-1) on physical", () => {
    // Arrange — 4 physical damage, interval 2 → floor(4/2) = 2 wound steps
    const sheet = makeSheet((s) => {
      s.damage.physical = 4
      s.qualities = [
        {
          name: "Low Pain Tolerance",
          type: "negative",
          effects: [
            { type: GameEffectType.painTolerance, target: DamageTrackKey.physical, value: -1 },
          ],
        },
      ]
    })

    // Act
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(2)
  })

  it("applies 4 boxes per wound step with High Pain Tolerance (+1) on stun", () => {
    // Arrange — 4 stun damage, interval 4 → floor(4/4) = 1 wound step
    const sheet = makeSheet((s) => {
      s.damage.stun = 4
      s.qualities = [
        {
          name: "High Pain Tolerance",
          type: "positive",
          effects: [
            { type: GameEffectType.painTolerance, target: DamageTrackKey.stun, value: 1 },
          ],
        },
      ]
    })

    // Act
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(1)
  })

  it("applies an 'all' target pain tolerance effect to both physical and stun tracks", () => {
    // Arrange — 4 physical + 4 stun, interval 4 → floor(4/4) + floor(4/4) = 2
    const sheet = makeSheet((s) => {
      s.damage.physical = 4
      s.damage.stun = 4
      s.qualities = [
        {
          name: "High Pain Tolerance",
          type: "positive",
          effects: [
            { type: GameEffectType.painTolerance, target: "all", value: 1 },
          ],
        },
      ]
    })

    // Act
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(2)
  })

  it("counts pain tolerance from equipped gear", () => {
    // Arrange — 6 physical damage, interval 4 via equipped gear → floor(6/4) = 1
    const [painBlocker] = createItem({
      name: "Pain Editor",
      itemType: ItemType.implant,
      equipped: true,
      effects: [
        { type: GameEffectType.painTolerance, target: DamageTrackKey.physical, value: 1 },
      ],
    })
    const sheet = makeSheet((s) => {
      s.damage.physical = 6
      s.gear = createItemMap([painBlocker])
    })

    // Act
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(1)
  })

  it("does not count pain tolerance from unequipped gear", () => {
    // Arrange — 6 physical damage, interval stays 3 (unequipped) → floor(6/3) = 2
    const [painBlocker] = createItem({
      name: "Pain Editor",
      itemType: ItemType.implant,
      equipped: false,
      effects: [
        { type: GameEffectType.painTolerance, target: DamageTrackKey.physical, value: 1 },
      ],
    })
    const sheet = makeSheet((s) => {
      s.damage.physical = 6
      s.gear = createItemMap([painBlocker])
    })

    // Act
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(2)
  })

  it("accumulates multiple pain tolerance effects from different sources", () => {
    // Arrange — +1 quality +1 gear → interval 5; 5 physical → floor(5/5) = 1
    const [painBlocker] = createItem({
      name: "Pain Editor",
      itemType: ItemType.implant,
      effects: [
        { type: GameEffectType.painTolerance, target: DamageTrackKey.physical, value: 1 },
      ],
    })
    const sheet = makeSheet((s) => {
      s.damage.physical = 5
      s.qualities = [
        {
          name: "High Pain Tolerance",
          type: "positive",
          effects: [
            { type: GameEffectType.painTolerance, target: DamageTrackKey.physical, value: 1 },
          ],
        },
      ]
      s.gear = createItemMap([painBlocker])
    })

    // Act
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeWrapper(sheet),
    })

    // Assert
    expect(result.current).toBe(1)
  })
})
