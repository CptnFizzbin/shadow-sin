import { act, renderHook } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { setDamage } from "./damage/damageSlice.actions.ts"
import { useRunnerSelector } from "./runnerSelector.ts"

describe("useRunnerSelector — reactivity", () => {
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
