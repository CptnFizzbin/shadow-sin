import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useRunnerSelector } from "#/lib/stores/runner/runnerSelector.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { makeRunnerDataWrapper } from "#testUtils/renderUtils.tsx"

describe("useRunnerSelector — damage namespace", () => {
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
    // Arrange
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

    // Assert — floor(3/3) + floor(3/3) = 2
    expect(result.current).toBe(2)
  })
})
