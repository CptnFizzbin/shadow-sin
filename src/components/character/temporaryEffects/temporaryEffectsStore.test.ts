import { describe, expect, it } from "vitest"

import type { TemporaryEffectData } from "#/system/gameEffects/gameEffectData.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"

import { TemporaryEffectsStore } from "./temporaryEffectsStore.ts"

function makeEffect(overrides: Partial<TemporaryEffectData> = {}): TemporaryEffectData {
  return {
    id: "test-id",
    label: "Test Effect",
    enabled: true,
    type: GameEffectType.attrMod,
    target: "body",
    value: 1,
    ...overrides,
  }
}

describe("TemporaryEffectsStore", () => {
  describe("add", () => {
    it("appends an effect to the store", () => {
      // Arrange
      const store = new TemporaryEffectsStore([])
      const effect = makeEffect({ id: "e1", label: "Bonus" })

      // Act
      store.add(effect)

      // Assert
      expect(store.state).toHaveLength(1)
      expect(store.state[0]).toMatchObject({ id: "e1", label: "Bonus" })
    })

    it("appends multiple effects without removing existing ones", () => {
      // Arrange
      const initial = makeEffect({ id: "e1" })
      const store = new TemporaryEffectsStore([initial])
      const second = makeEffect({ id: "e2", label: "Second" })

      // Act
      store.add(second)

      // Assert
      expect(store.state).toHaveLength(2)
    })
  })

  describe("remove", () => {
    it("removes the effect with the given id", () => {
      // Arrange
      const effectToKeep = makeEffect({ id: "keep", label: "Keep" })
      const effectToRemove = makeEffect({ id: "remove", label: "Remove" })
      const store = new TemporaryEffectsStore([effectToKeep, effectToRemove])

      // Act
      store.remove("remove")

      // Assert
      expect(store.state).toHaveLength(1)
      expect(store.state[0].id).toBe("keep")
    })

    it("does nothing when the id does not exist", () => {
      // Arrange
      const effect = makeEffect({ id: "existing" })
      const store = new TemporaryEffectsStore([effect])

      // Act
      store.remove("nonexistent")

      // Assert
      expect(store.state).toHaveLength(1)
    })
  })

  describe("toggle", () => {
    it("flips enabled from true to false", () => {
      // Arrange
      const effect = makeEffect({ id: "e1", enabled: true })
      const store = new TemporaryEffectsStore([effect])

      // Act
      store.toggle("e1")

      // Assert
      expect(store.state[0].enabled).toBe(false)
    })

    it("flips enabled from false to true", () => {
      // Arrange
      const effect = makeEffect({ id: "e1", enabled: false })
      const store = new TemporaryEffectsStore([effect])

      // Act
      store.toggle("e1")

      // Assert
      expect(store.state[0].enabled).toBe(true)
    })

    it("only toggles the targeted effect", () => {
      // Arrange
      const effectA = makeEffect({ id: "a", enabled: true })
      const effectB = makeEffect({ id: "b", enabled: true })
      const store = new TemporaryEffectsStore([effectA, effectB])

      // Act
      store.toggle("a")

      // Assert
      expect(store.state.find((e) => e.id === "a")?.enabled).toBe(false)
      expect(store.state.find((e) => e.id === "b")?.enabled).toBe(true)
    })
  })

  describe("update", () => {
    it("replaces the effect with the matching id", () => {
      // Arrange
      const original = makeEffect({ id: "e1", label: "Old Label", value: 1 })
      const store = new TemporaryEffectsStore([original])
      const updated = makeEffect({ id: "e1", label: "New Label", value: 3 })

      // Act
      store.update(updated)

      // Assert
      expect(store.state[0].label).toBe("New Label")
      expect(store.state[0].value).toBe(3)
    })

    it("does not modify other effects", () => {
      // Arrange
      const effectA = makeEffect({ id: "a", label: "A" })
      const effectB = makeEffect({ id: "b", label: "B" })
      const store = new TemporaryEffectsStore([effectA, effectB])

      // Act
      store.update(makeEffect({ id: "a", label: "Updated A" }))

      // Assert
      expect(store.state.find((e) => e.id === "b")?.label).toBe("B")
    })
  })
})
