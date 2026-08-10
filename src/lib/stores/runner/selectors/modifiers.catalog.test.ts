import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useRunnerSelector } from "#/lib/stores/runner/runnerSelector.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { makeRunnerDataWrapper } from "#testUtils/renderUtils.tsx"

import { Modifier } from "./modifiers.catalog.ts"

describe("useRunnerSelector — namespace aliasing", () => {
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
