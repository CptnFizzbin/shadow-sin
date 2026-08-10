import { act, renderHook } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { makeRunnerDataWrapper } from "#testUtils/renderUtils.tsx"

import { setDamage } from "./damage/damageSlice.actions.ts"
import { Modifier, useRunnerSelector } from "./runnerSelector.ts"

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
