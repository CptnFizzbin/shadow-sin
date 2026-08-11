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
      () => useRunnerSelector(({ damage }) => damage.track(DamageTrackKey.physical)),
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
  it("applies RunnerData to a curried catalog entry itself, not to its (already-invoked) result", () => {
    // Arrange
    const store = new RunnerDataStore(runnerDataFactory())
    const Wrapper: FC<PropsWithChildren> = ({ children }) => (
      <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
    )

    // Act — the picker returns `karmaCaps.activeSkill` unapplied; the hook applies RunnerData once
    const { result } = renderHook(
      () => useRunnerSelector(({ karmaCaps }) => karmaCaps.activeSkill),
      { wrapper: Wrapper },
    )

    // Assert — the caller gets back a per-skill lookup function, no RunnerData argument in sight
    expect(typeof result.current).toBe("function")
    expect(result.current(SkillKey.pistols)).toEqual({ cap: 6, hasAptitude: false })
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
