import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { NullUuid } from "#/lib/uuidUtils.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { EntityKind } from "#/system/entityKind.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { makeRunnerDataWrapper } from "#testUtils/renderUtils.tsx"

import { useGameEffects } from "./useGameEffects.ts"

describe("useGameEffects", () => {
  it("returns an empty array when there are no matching effects on the sheet", () => {
    // Arrange
    const sheet = runnerDataFactory()

    // Act
    const { result } = renderHook(() => useGameEffects(GameEffectType.attrMod), {
      wrapper: makeRunnerDataWrapper(sheet),
    })

    // Assert
    expect(result.current).toEqual([])
  })

  it("returns effects of the requested type from the runner sheet", () => {
    // Arrange
    const sheet = runnerDataFactory((s) => {
      s.qualities = [
        {
          kind: EntityKind.quality,
          id: NullUuid,
          name: "Aptitude",
          type: "positive",
          effects: [{ type: GameEffectType.attrMod, target: AttributeKey.logic, value: 1 }],
        },
      ]
      return s
    })

    // Act
    const { result } = renderHook(() => useGameEffects(GameEffectType.attrMod), {
      wrapper: makeRunnerDataWrapper(sheet),
    })

    // Assert
    expect(result.current).toHaveLength(1)
    expect(result.current[0]).toMatchObject({ type: GameEffectType.attrMod, target: AttributeKey.logic, value: 1 })
  })

  it("does not return effects of other types", () => {
    // Arrange
    const sheet = runnerDataFactory((s) => {
      s.qualities = [
        {
          kind: EntityKind.quality,
          id: NullUuid,
          name: "Aptitude",
          type: "positive",
          effects: [{ type: GameEffectType.attrMod, target: AttributeKey.logic, value: 1 }],
        },
      ]
      return s
    })

    // Act
    const { result } = renderHook(() => useGameEffects(GameEffectType.initiativeBonus), {
      wrapper: makeRunnerDataWrapper(sheet),
    })

    // Assert
    expect(result.current).toEqual([])
  })
})
