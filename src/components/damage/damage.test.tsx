import { renderHook } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { CharacterSheetProvider } from "#/components/character/characterSheetProvider.tsx"
import { CharacterSheetStore } from "#/components/character/characterSheetStore.ts"
import { createDefaultCharacterSheet } from "#/components/character/createDefaultCharacterSheet.ts"
import { useDamageStore } from "#/components/damage/useDamageStore.ts"
import { useWoundModifier } from "#/components/damage/useWoundModifier.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
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
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeWrapper(makeSheet()),
    })
    expect(result.current).toBe(0)
  })

  it("computes the default wound modifier at every 3 boxes", () => {
    // 3 physical + 3 stun → -1 + -1 = -2
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeWrapper(makeSheet((sheet) => {
        sheet.damage.physical = 3
        sheet.damage.stun = 3
      })),
    })
    expect(result.current).toBe(2)
  })

  it("applies 2 boxes per wound step with Low Pain Tolerance (-1) on physical", () => {
    // 4 physical damage, interval 2 → floor(4/2) = 2 wound steps
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeWrapper(makeSheet((sheet) => {
        sheet.damage.physical = 4
        sheet.qualities = [
          {
            name: "Low Pain Tolerance",
            type: "negative",
            effects: [
              { type: GameEffectType.painTolerance, target: DamageTrackKey.physical, value: -1 },
            ],
          },
        ]
      })),
    })
    expect(result.current).toBe(2)
  })

  it("applies 4 boxes per wound step with High Pain Tolerance (+1) on stun", () => {
    // 4 stun damage, interval 4 → floor(4/4) = 1 wound step
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeWrapper(makeSheet((sheet) => {
        sheet.damage.stun = 4
        sheet.qualities = [
          {
            name: "High Pain Tolerance",
            type: "positive",
            effects: [
              { type: GameEffectType.painTolerance, target: DamageTrackKey.stun, value: 1 },
            ],
          },
        ]
      })),
    })
    expect(result.current).toBe(1)
  })

  it("applies an 'all' target pain tolerance effect to both physical and stun tracks", () => {
    // 4 physical + 4 stun, interval 4 → floor(4/4) + floor(4/4) = 2
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeWrapper(makeSheet((sheet) => {
        sheet.damage.physical = 4
        sheet.damage.stun = 4
        sheet.qualities = [
          {
            name: "High Pain Tolerance",
            type: "positive",
            effects: [
              { type: GameEffectType.painTolerance, target: "all", value: 1 },
            ],
          },
        ]
      })),
    })
    expect(result.current).toBe(2)
  })

  it("counts pain tolerance from equipped gear", () => {
    // 6 physical damage, interval 4 via equipped gear → floor(6/4) = 1
    const [painBlocker] = createItem({
      name: "Pain Editor",
      itemType: ItemType.implant,
      equipped: true,
      effects: [
        { type: GameEffectType.painTolerance, target: DamageTrackKey.physical, value: 1 },
      ],
    })
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeWrapper(makeSheet((sheet) => {
        sheet.damage.physical = 6
        sheet.gear = createItemMap([painBlocker])
      })),
    })
    expect(result.current).toBe(1)
  })

  it("does not count pain tolerance from unequipped gear", () => {
    // 6 physical damage, interval stays 3 because gear is unequipped → floor(6/3) = 2
    const [painBlocker] = createItem({
      name: "Pain Editor",
      itemType: ItemType.implant,
      equipped: false,
      effects: [
        { type: GameEffectType.painTolerance, target: DamageTrackKey.physical, value: 1 },
      ],
    })
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeWrapper(makeSheet((sheet) => {
        sheet.damage.physical = 6
        sheet.gear = createItemMap([painBlocker])
      })),
    })
    expect(result.current).toBe(2)
  })

  it("accumulates multiple pain tolerance effects from different sources", () => {
    // +1 from quality, +1 from gear → interval 5 for physical
    // 5 physical damage → floor(5/5) = 1
    const [painBlocker] = createItem({
      name: "Pain Editor",
      itemType: ItemType.implant,
      effects: [
        { type: GameEffectType.painTolerance, target: DamageTrackKey.physical, value: 1 },
      ],
    })
    const { result } = renderHook(() => useWoundModifier(), {
      wrapper: makeWrapper(makeSheet((sheet) => {
        sheet.damage.physical = 5
        sheet.qualities = [
          {
            name: "High Pain Tolerance",
            type: "positive",
            effects: [
              { type: GameEffectType.painTolerance, target: DamageTrackKey.physical, value: 1 },
            ],
          },
        ]
        sheet.gear = createItemMap([painBlocker])
      })),
    })
    expect(result.current).toBe(1)
  })
})

describe("useDamageStore", () => {
  it("returns default wound interval of 3 with no pain tolerance effects", () => {
    const { result } = renderHook(() => useDamageStore(), {
      wrapper: makeWrapper(makeSheet()),
    })
    expect(result.current.physical.woundInterval).toBe(3)
    expect(result.current.stun.woundInterval).toBe(3)
  })

  it("returns wound interval of 2 for physical with Low Pain Tolerance (-1)", () => {
    const { result } = renderHook(() => useDamageStore(), {
      wrapper: makeWrapper(makeSheet((sheet) => {
        sheet.qualities = [
          {
            name: "Low Pain Tolerance",
            type: "negative",
            effects: [
              { type: GameEffectType.painTolerance, target: DamageTrackKey.physical, value: -1 },
            ],
          },
        ]
      })),
    })
    expect(result.current.physical.woundInterval).toBe(2)
    expect(result.current.stun.woundInterval).toBe(3)
  })

  it("returns wound interval of 4 for stun with High Pain Tolerance (+1)", () => {
    const { result } = renderHook(() => useDamageStore(), {
      wrapper: makeWrapper(makeSheet((sheet) => {
        sheet.qualities = [
          {
            name: "High Pain Tolerance",
            type: "positive",
            effects: [
              { type: GameEffectType.painTolerance, target: DamageTrackKey.stun, value: 1 },
            ],
          },
        ]
      })),
    })
    expect(result.current.physical.woundInterval).toBe(3)
    expect(result.current.stun.woundInterval).toBe(4)
  })

  it("returns wound interval of 4 for both tracks with 'all' target", () => {
    const { result } = renderHook(() => useDamageStore(), {
      wrapper: makeWrapper(makeSheet((sheet) => {
        sheet.qualities = [
          {
            name: "High Pain Tolerance",
            type: "positive",
            effects: [
              { type: GameEffectType.painTolerance, target: "all", value: 1 },
            ],
          },
        ]
      })),
    })
    expect(result.current.physical.woundInterval).toBe(4)
    expect(result.current.stun.woundInterval).toBe(4)
  })

  it("clamps wound interval to a minimum of 1 for extreme negative pain tolerance", () => {
    const { result } = renderHook(() => useDamageStore(), {
      wrapper: makeWrapper(makeSheet((sheet) => {
        sheet.qualities = [
          {
            name: "Extreme Pain Intolerance",
            type: "negative",
            effects: [
              { type: GameEffectType.painTolerance, target: DamageTrackKey.physical, value: -10 },
            ],
          },
        ]
      })),
    })
    expect(result.current.physical.woundInterval).toBe(1)
  })

  it("computes physical max from body attribute", () => {
    const { result } = renderHook(() => useDamageStore(), {
      wrapper: makeWrapper(makeSheet((sheet) => {
        sheet.attributes[AttributeKey.body] = 4
      })),
    })
    // 8 + ceil(4/2) = 8 + 2 = 10
    expect(result.current.physical.max).toBe(10)
  })

  it("computes stun max from willpower attribute", () => {
    const { result } = renderHook(() => useDamageStore(), {
      wrapper: makeWrapper(makeSheet((sheet) => {
        sheet.attributes[AttributeKey.willpower] = 6
      })),
    })
    // 8 + ceil(6/2) = 8 + 3 = 11
    expect(result.current.stun.max).toBe(11)
  })

  it("reflects current damage values", () => {
    const { result } = renderHook(() => useDamageStore(), {
      wrapper: makeWrapper(makeSheet((sheet) => {
        sheet.damage.physical = 5
        sheet.damage.stun = 2
      })),
    })
    expect(result.current.physical.current).toBe(5)
    expect(result.current.stun.current).toBe(2)
  })
})
