import { act, renderHook } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

import { setDamage } from "./damage/damageSlice.actions.ts"
import { useRunnerSelector } from "./runnerSelector.ts"

describe("useRunnerSelector — reactivity", () => {
  it("picks up a dispatched change to the underlying runner store", () => {
    // Arrange
    const store = new RunnerDataStore(runnerDataFactory((s) => {
      s.damage.physical = 0
      return s
    }))
    const Wrapper: FC<PropsWithChildren> = ({ children }) => (
      <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
    )

    const { result } = renderHook(
      () => useRunnerSelector(({ damage }) => damage.forTrack(DamageTrackKey.physical)),
      { wrapper: Wrapper },
    )
    expect(result.current.current).toBe(0)

    // Act
    act(() => {
      store.dispatch(setDamage({ track: DamageTrackKey.physical, value: 4 }))
    })

    // Assert
    expect(result.current.current).toBe(4)
  })
})

describe("useRunnerSelector — picker returns a Selector, not a precomputed value", () => {
  it("resolves an `all` lookup covering every key in one Selector application", () => {
    // Arrange
    const store = new RunnerDataStore(runnerDataFactory())
    const Wrapper: FC<PropsWithChildren> = ({ children }) => (
      <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
    )

    // Act
    const { result } = renderHook(
      () => useRunnerSelector(({ karmaCaps }) => karmaCaps.activeSkill.all),
      { wrapper: Wrapper },
    )

    // Assert
    expect(result.current[SkillKey.pistols]).toEqual({ cap: 6, hasAptitude: false })
  })

  it("resolves a `forSkill` scoped lookup to a single Selector, picked by field", () => {
    // Arrange
    const store = new RunnerDataStore(runnerDataFactory())
    const Wrapper: FC<PropsWithChildren> = ({ children }) => (
      <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
    )

    // Act — the picker calls `forSkill` inside itself and returns one of its Selector fields
    const { result } = renderHook(
      () => useRunnerSelector(({ karmaCaps }) => karmaCaps.activeSkill.forSkill(SkillKey.pistols).cap),
      { wrapper: Wrapper },
    )

    // Assert
    expect(result.current).toBe(6)
  })

  it("re-derives the applied value on every render without a stale closure over an old state", () => {
    // Arrange
    const store = new RunnerDataStore(runnerDataFactory((s) => {
      s.initiateGrade = 1
      return s
    }))
    const Wrapper: FC<PropsWithChildren> = ({ children }) => (
      <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
    )

    const { result } = renderHook(
      () => useRunnerSelector(({ magicAdvancement }) => magicAdvancement.initiateGrade),
      { wrapper: Wrapper },
    )
    expect(result.current).toBe(1)

    // Act
    act(() => {
      store.setState((prev) => ({ ...prev, initiateGrade: 2 }))
    })

    // Assert
    expect(result.current).toBe(2)
  })
})
