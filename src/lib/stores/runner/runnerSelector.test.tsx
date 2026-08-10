import { act, renderHook } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"
import { ImplantGrade, ImplantType } from "#/system/gear/implantData.ts"
import { createItem, createItemMap } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { makeRunnerDataWrapper } from "#testUtils/renderUtils.tsx"

import { setDamage } from "./damage/damageSlice.actions.ts"
import { useRunnerSelector } from "./runnerSelector.ts"
import { Modifier } from "./selectors/modifiers.catalog.ts"

describe("useRunnerSelector", () => {
  describe("attribute namespace", () => {
    it("reads an attribute's base value from the runner sheet", () => {
      // Arrange
      const sheet = runnerDataFactory((s) => {
        s.attributes.body = 5
        return s
      })

      // Act
      const { result } = renderHook(
        () => useRunnerSelector(({ attribute }) => attribute(AttributeKey.body).baseValue),
        { wrapper: makeRunnerDataWrapper(sheet) },
      )

      // Assert
      expect(result.current).toBe(5)
    })

    it("reads an attribute's info alongside its base value", () => {
      // Arrange
      const sheet = runnerDataFactory()

      // Act
      const { result } = renderHook(
        () => useRunnerSelector(({ attribute }) => attribute(AttributeKey.body).info),
        { wrapper: makeRunnerDataWrapper(sheet) },
      )

      // Assert
      expect(result.current).toBeDefined()
    })

    it("defaults an unset attribute (e.g. a Matrix stat on a Runner) to 0", () => {
      // Arrange — Runners never populate the Matrix stats (see AttributeKey docs)
      const sheet = runnerDataFactory()

      // Act
      const { result } = renderHook(
        () => useRunnerSelector(({ attribute }) => attribute(AttributeKey.system).baseValue),
        { wrapper: makeRunnerDataWrapper(sheet) },
      )

      // Assert
      expect(result.current).toBe(0)
    })
  })

  describe("damage namespace", () => {
    it("reads a damage track's current value", () => {
      // Arrange
      const sheet = runnerDataFactory((s) => {
        s.damage.physical = 3
        return s
      })

      // Act
      const { result } = renderHook(
        () => useRunnerSelector(({ damage }) => damage(DamageTrackKey.physical).current),
        { wrapper: makeRunnerDataWrapper(sheet) },
      )

      // Assert
      expect(result.current).toBe(3)
    })

    it("computes the wound modifier as a bare property", () => {
      // Arrange — 3 physical + 3 stun → floor(3/3) + floor(3/3) = 2, same fixture as
      // useWoundModifier.test.ts
      const sheet = runnerDataFactory((s) => {
        s.damage.physical = 3
        s.damage.stun = 3
        return s
      })

      // Act
      const { result } = renderHook(
        () => useRunnerSelector(({ damage }) => damage.woundMod),
        { wrapper: makeRunnerDataWrapper(sheet) },
      )

      // Assert
      expect(result.current).toBe(2)
    })
  })

  describe("item namespace", () => {
    it("looks up a single item by id", () => {
      // Arrange
      const [jacket] = createItem<ArmorData>({
        name: "Armor Jacket",
        itemType: ItemType.armor,
        ballistic: 6,
        impact: 4,
        equipped: true,
      })
      const sheet = runnerDataFactory((s) => {
        s.gear = createItemMap([jacket])
        return s
      })

      // Act
      const { result } = renderHook(
        () => useRunnerSelector(({ item }) => item(jacket.id)),
        { wrapper: makeRunnerDataWrapper(sheet) },
      )

      // Assert
      expect(result.current).toMatchObject({ name: "Armor Jacket" })
    })

    it("filters by item type", () => {
      // Arrange
      const [jacket] = createItem<ArmorData>({
        name: "Armor Jacket", itemType: ItemType.armor, ballistic: 6, impact: 4,
      })
      const [cyberware] = createItem<ImplantData>({
        name: "Wired Reflexes", itemType: ItemType.implant, essenceCost: 2,
      })
      const sheet = runnerDataFactory((s) => {
        s.gear = createItemMap([jacket], [cyberware])
        return s
      })

      // Act
      const { result } = renderHook(
        () => useRunnerSelector(({ item }) => item.byType(ItemType.armor)),
        { wrapper: makeRunnerDataWrapper(sheet) },
      )

      // Assert
      expect(result.current).toHaveLength(1)
      expect(result.current[0]).toMatchObject({ name: "Armor Jacket" })
    })

    it("reads only equipped items across types", () => {
      // Arrange
      const [equipped] = createItem<ArmorData>({
        name: "Worn Jacket", itemType: ItemType.armor, ballistic: 6, impact: 4, equipped: true,
      })
      const [stashed] = createItem<ArmorData>({
        name: "Spare Jacket", itemType: ItemType.armor, ballistic: 6, impact: 4, equipped: false,
      })
      const sheet = runnerDataFactory((s) => {
        s.gear = createItemMap([equipped], [stashed])
        return s
      })

      // Act
      const { result } = renderHook(
        () => useRunnerSelector(({ item }) => item.equipped),
        { wrapper: makeRunnerDataWrapper(sheet) },
      )

      // Assert
      expect(result.current.map((i) => i.name)).toEqual(["Worn Jacket"])
    })

    it("sums equipped armor for total and takes the best equipped piece for effective", () => {
      // Arrange — two equipped armor pieces stack for total, but only the highest applies as
      // effective (unequipped armor counts toward neither)
      const [jacket] = createItem<ArmorData>({
        name: "Armor Jacket", itemType: ItemType.armor, ballistic: 6, impact: 4, equipped: true,
      })
      const [vest] = createItem<ArmorData>({
        name: "Armor Vest", itemType: ItemType.armor, ballistic: 3, impact: 2, equipped: true,
      })
      const [spare] = createItem<ArmorData>({
        name: "Spare Jacket", itemType: ItemType.armor, ballistic: 6, impact: 4, equipped: false,
      })
      const sheet = runnerDataFactory((s) => {
        s.gear = createItemMap([jacket], [vest], [spare])
        return s
      })
      const wrapper = makeRunnerDataWrapper(sheet)

      // Act
      const total = renderHook(() => useRunnerSelector(({ item }) => item.armor.total), { wrapper })
      const effective = renderHook(() => useRunnerSelector(({ item }) => item.armor.effective), { wrapper })

      // Assert
      expect(total.result.current).toEqual({ ballistic: 9, impact: 6 })
      expect(effective.result.current).toEqual({ ballistic: 6, impact: 4 })
    })

    it("computes essence usage against the attribute namespace's essence cap", () => {
      // Arrange — 2 cyberware + 1 bioware essence, smaller (bioware) counts at half:
      // used = 2 + (1 / 2) = 2.5, remaining = 6 - 2.5 = 3.5
      const [cyberware] = createItem<ImplantData>({
        name: "Wired Reflexes",
        itemType: ItemType.implant,
        implantType: ImplantType.cyberware,
        grade: ImplantGrade.standard,
        essenceCost: 2,
      })
      const [bioware] = createItem<ImplantData>({
        name: "Muscle Toner",
        itemType: ItemType.implant,
        implantType: ImplantType.bioware,
        grade: ImplantGrade.standard,
        essenceCost: 1,
      })
      const sheet = runnerDataFactory((s) => {
        s.gear = createItemMap([cyberware], [bioware])
        return s
      })

      // Act
      const { result } = renderHook(
        () => useRunnerSelector(({ item }) => item.essence),
        { wrapper: makeRunnerDataWrapper(sheet) },
      )

      // Assert
      expect(result.current).toEqual({
        used: 2.5,
        remaining: 3.5,
        cyberwareEssence: 2,
        biowareEssence: 1,
      })
    })
  })

  describe("namespace aliasing", () => {
    it("resolves the same wound modifier value through damage.woundMod and modifiers(Modifier.woundMod)", () => {
      // Arrange
      const sheet = runnerDataFactory((s) => {
        s.damage.physical = 3
        s.damage.stun = 3
        return s
      })
      const wrapper = makeRunnerDataWrapper(sheet)

      // Act
      const viaDamage = renderHook(
        () => useRunnerSelector(({ damage }) => damage.woundMod),
        { wrapper },
      )
      const viaModifiers = renderHook(
        () => useRunnerSelector(({ modifiers }) => modifiers(Modifier.woundMod).value),
        { wrapper },
      )

      // Assert — both namespaces resolve to the same underlying computation
      expect(viaDamage.result.current).toBe(viaModifiers.result.current)
      expect(viaDamage.result.current).toBe(2)
    })
  })

  describe("reactivity", () => {
    it("picks up a dispatched change to the underlying runner store", () => {
      // Arrange
      const store = new RunnerDataStore(runnerDataFactory((s) => {
        s.damage.physical = 0
        return s
      }))
      const wrapper: FC<PropsWithChildren> = ({ children }) => (
        <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
      )

      const { result } = renderHook(
        () => useRunnerSelector(({ damage }) => damage(DamageTrackKey.physical).current),
        { wrapper },
      )
      expect(result.current).toBe(0)

      // Act
      act(() => {
        store.dispatch(setDamage({ track: DamageTrackKey.physical, value: 4 }))
      })

      // Assert
      expect(result.current).toBe(4)
    })
  })
})
