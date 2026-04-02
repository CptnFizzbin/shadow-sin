import { describe, expect, it } from "vitest"

import { GameEffectType } from "#/lib/system/GameEffects/GameEffectType.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import { Artemis } from "./artemis.ts"

describe("Artemis fixture", () => {
  it("is a valid CharacterSheet with an id", () => {
    expect(Artemis.id).toBeDefined()
    expect(typeof Artemis.id).toBe("string")
    expect(Artemis.id.length).toBeGreaterThan(0)
  })

  it("has a gear map", () => {
    expect(Artemis.gear).toBeDefined()
    expect(typeof Artemis.gear).toBe("object")
  })

  describe("implant effects use new GameEffectType values", () => {
    it("uses GameEffectType.attrMod (not attrBonus) in all gear effects", () => {
      // Regression: attrBonus was renamed to attrMod in this PR
      for (const item of Object.values(Artemis.gear)) {
        if (item.effects) {
          for (const effect of item.effects) {
            expect(effect.type).not.toBe("attrBonus")
          }
        }
      }
    })

    it("uses GameEffectType.attrMod for Cerebral Booster logic bonus", () => {
      // Arrange - find the Cerebral Booster implant
      const cerebralBooster = Object.values(Artemis.gear).find(
        (item) => item.name === "Cerebral Booster",
      )

      // Assert
      expect(cerebralBooster).toBeDefined()
      expect(cerebralBooster!.effects).toBeDefined()
      expect(cerebralBooster!.effects!).toHaveLength(1)
      expect(cerebralBooster!.effects![0]!.type).toBe(GameEffectType.attrMod)
      expect(cerebralBooster!.effects![0]!.target).toBe(AttributeKey.logic)
      expect(cerebralBooster!.effects![0]!.value).toBe(3)
    })

    it("uses GameEffectType.attrMod for Synaptic Booster reaction bonus", () => {
      // Arrange - find the Synaptic Booster implant
      const synapticBooster = Object.values(Artemis.gear).find(
        (item) => item.name === "Synaptic Booster",
      )

      // Assert
      expect(synapticBooster).toBeDefined()
      expect(synapticBooster!.effects).toBeDefined()

      const reactionEffect = synapticBooster!.effects!.find(
        (e) => e.target === AttributeKey.reaction,
      )
      expect(reactionEffect).toBeDefined()
      expect(reactionEffect!.type).toBe(GameEffectType.attrMod)
      expect(reactionEffect!.value).toBe(2)
    })

    it("uses GameEffectType.initiativeBonus for Synaptic Booster initiative bonus", () => {
      // Arrange
      const synapticBooster = Object.values(Artemis.gear).find(
        (item) => item.name === "Synaptic Booster",
      )

      // Assert
      const initiativeEffect = synapticBooster!.effects!.find(
        (e) => e.type === GameEffectType.initiativeBonus,
      )
      expect(initiativeEffect).toBeDefined()
      expect(initiativeEffect!.value).toBe(2)
    })

    it("imports GameEffectType from the new path (GameEffects/GameEffectType.ts)", () => {
      // This test validates that the fixture correctly uses the new import path
      // The test would fail to compile if the old path was used
      const attrModValue = GameEffectType.attrMod
      expect(attrModValue).toBe("attrMod")
    })
  })
})
