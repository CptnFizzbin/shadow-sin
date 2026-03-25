// @vitest-environment jsdom
import { Store } from "@tanstack/store"
import { act, renderHook } from "@testing-library/react"
import type { Draft } from "immer"
import { describe, expect, it } from "vitest"

import { useStoreSlice } from "#/integrations/tanstack-store/StoreUtils.ts"

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("useStoreSlice", () => {
  // ─── Fixtures for object slices ─────────────────────────────────────────────

  type RootState = {
    player: { name: string, health: number }
    session: { score: number }
  }

  const makeStore = (overrides?: Partial<RootState>): Store<RootState> =>
    new Store<RootState>({
      player: { name: "Neo", health: 100 },
      session: { score: 0 },
      ...overrides,
    })

  const selectPlayer = (state: RootState) => state.player

  const setPlayer = (
    draft: Draft<RootState>,
    nextPlayer: Draft<RootState["player"]>,
  ): Draft<RootState> => {
    draft.player = nextPlayer
    return draft
  }

  describe("state", () => {
    it("returns the selected slice of the store on initial render", () => {
      // Arrange
      const store = makeStore()

      // Act
      const { result } = renderHook(() =>
        useStoreSlice(store, selectPlayer, setPlayer),
      )

      // Assert
      expect(result.current.state).toEqual({ name: "Neo", health: 100 })
    })

    it("does not include fields from other slices", () => {
      // Arrange
      const store = makeStore({ session: { score: 42 } })

      // Act
      const { result } = renderHook(() =>
        useStoreSlice(store, selectPlayer, setPlayer),
      )

      // Assert
      expect(result.current.state).not.toHaveProperty("score")
    })
  })

  describe("update", () => {
    it("applies a mutating recipe and persists the change to the store", () => {
      // Arrange
      const store = makeStore()
      const { result } = renderHook(() =>
        useStoreSlice(store, selectPlayer, setPlayer),
      )

      // Act
      act(() => {
        result.current.update((draft) => {
          draft.health = 50
        })
      })

      // Assert
      expect(result.current.state.health).toBe(50)
      expect(store.state.player.health).toBe(50)
    })

    it("applies a replacing recipe (recipe returns a new value) and persists the change", () => {
      // Arrange
      const store = makeStore()
      const { result } = renderHook(() =>
        useStoreSlice(store, selectPlayer, setPlayer),
      )

      // Act
      act(() => {
        result.current.update(() => ({ name: "Morpheus", health: 80 }))
      })

      // Assert
      expect(result.current.state).toEqual({ name: "Morpheus", health: 80 })
      expect(store.state.player).toEqual({ name: "Morpheus", health: 80 })
    })

    it("does not affect unrelated slices of the store", () => {
      // Arrange
      const store = makeStore({ session: { score: 99 } })
      const { result } = renderHook(() =>
        useStoreSlice(store, selectPlayer, setPlayer),
      )

      // Act
      act(() => {
        result.current.update((draft) => {
          draft.name = "Trinity"
        })
      })

      // Assert
      expect(store.state.session.score).toBe(99)
    })
  })

  describe("array slice", () => {
    // ─── Fixtures for array slice tests (scoped here) ──────────────────────────

    type InventoryItem = { id: string, name: string, quantity: number }

    type GameState = {
      inventory: InventoryItem[]
      gold: number
    }

    const makeGameStore = (overrides?: Partial<GameState>): Store<GameState> =>
      new Store<GameState>({
        inventory: [
          { id: "sword", name: "Iron Sword", quantity: 1 },
          { id: "potion", name: "Health Potion", quantity: 3 },
        ],
        gold: 100,
        ...overrides,
      })

    const selectInventory = (state: GameState) => state.inventory

    const setInventory = (
      draft: Draft<GameState>,
      nextInventory: Draft<GameState["inventory"]>,
    ): Draft<GameState> => {
      draft.inventory = nextInventory
      return draft
    }

    it("returns the array slice on initial render", () => {
      // Arrange
      const store = makeGameStore()

      // Act
      const { result } = renderHook(() =>
        useStoreSlice(store, selectInventory, setInventory),
      )

      // Assert
      expect(result.current.state).toHaveLength(2)
      expect(result.current.state[0]).toEqual({
        id: "sword",
        name: "Iron Sword",
        quantity: 1,
      })
    })

    it("pushes a new item into the array via a mutating recipe", () => {
      // Arrange
      const store = makeGameStore()
      const { result } = renderHook(() =>
        useStoreSlice(store, selectInventory, setInventory),
      )

      // Act
      act(() => {
        result.current.update((draft) => {
          draft.push({ id: "shield", name: "Wooden Shield", quantity: 1 })
        })
      })

      // Assert
      expect(result.current.state).toHaveLength(3)
      expect(store.state.inventory[2]).toEqual({
        id: "shield",
        name: "Wooden Shield",
        quantity: 1,
      })
    })

    it("mutates an existing item in the array", () => {
      // Arrange
      const store = makeGameStore()
      const { result } = renderHook(() =>
        useStoreSlice(store, selectInventory, setInventory),
      )

      // Act
      act(() => {
        result.current.update((draft) => {
          const potion = draft.find((item) => item.id === "potion")
          if (potion) potion.quantity = 10
        })
      })

      // Assert
      expect(
        result.current.state.find((item) => item.id === "potion")?.quantity,
      ).toBe(10)
      expect(
        store.state.inventory.find((item) => item.id === "potion")?.quantity,
      ).toBe(10)
    })

    it("does not change other items when updating one item", () => {
      // Arrange
      const store = makeGameStore()
      const { result } = renderHook(() =>
        useStoreSlice(store, selectInventory, setInventory),
      )

      const swordBefore = result.current.state.find((i) => i.id === "sword")!

      // Act — update potion only
      act(() => {
        result.current.update((draft) => {
          const potion = draft.find((item) => item.id === "potion")
          if (potion) potion.quantity = 99
        })
      })

      // Assert — sword remains unchanged
      const swordAfter = result.current.state.find((i) => i.id === "sword")!
      expect(swordAfter.quantity).toBe(swordBefore.quantity)
      expect(swordAfter.id).toBe(swordBefore.id)
      expect(
        store.state.inventory.find((i) => i.id === "sword")?.quantity,
      ).toBe(1)
    })

    it("filters items out of the array via a replacing recipe", () => {
      // Arrange
      const store = makeGameStore()
      const { result } = renderHook(() =>
        useStoreSlice(store, selectInventory, setInventory),
      )

      // Act — Array.filter() returns a new array, so this exercises the replace path
      act(() => {
        result.current.update((draft) =>
          draft.filter((item) => item.id !== "sword"),
        )
      })

      // Assert
      expect(result.current.state).toHaveLength(1)
      expect(result.current.state[0].id).toBe("potion")
      expect(store.state.inventory).toHaveLength(1)
    })

    it("replaces an item via a mapping replacing recipe (returns a new array)", () => {
      // Arrange
      const store = makeGameStore()
      const { result } = renderHook(() =>
        useStoreSlice(store, selectInventory, setInventory),
      )

      const updatedItem = { id: "potion", name: "Health Potion", quantity: 42 }

      // Act — updater returns a new array via map()
      act(() => {
        result.current.update((draft) =>
          draft.map((item) =>
            item.id === updatedItem.id ? updatedItem : item,
          ),
        )
      })

      // Assert — potion is updated, sword is unchanged
      expect(
        result.current.state.find((i) => i.id === "potion")?.quantity,
      ).toBe(42)
      expect(
        store.state.inventory.find((i) => i.id === "potion")?.quantity,
      ).toBe(42)
      expect(result.current.state.find((i) => i.id === "sword")?.quantity).toBe(
        1,
      )
    })

    it("does not affect unrelated store state when the array slice is updated", () => {
      // Arrange
      const store = makeGameStore({ gold: 250 })
      const { result } = renderHook(() =>
        useStoreSlice(store, selectInventory, setInventory),
      )

      // Act
      act(() => {
        result.current.update((draft) => {
          draft.push({ id: "bow", name: "Short Bow", quantity: 1 })
        })
      })

      // Assert
      expect(store.state.gold).toBe(250)
    })
  })

  describe("reactivity", () => {
    it("re-renders with updated state when the store is mutated via update()", () => {
      // Arrange
      const store = makeStore()
      const { result } = renderHook(() =>
        useStoreSlice(store, selectPlayer, setPlayer),
      )

      // Act
      act(() => {
        result.current.update((draft) => {
          draft.health = 25
        })
      })

      // Assert
      expect(result.current.state.health).toBe(25)
    })

    it("re-renders with updated state when the store is mutated externally", () => {
      // Arrange
      const store = makeStore()
      const { result } = renderHook(() =>
        useStoreSlice(store, selectPlayer, setPlayer),
      )

      // Act
      act(() => {
        store.setState((prev) => ({
          ...prev,
          player: { ...prev.player, health: 25 },
        }))
      })

      // Assert
      expect(result.current.state.health).toBe(25)
    })

    it("preserves the same state reference when an unrelated slice changes", () => {
      // Arrange
      const store = makeStore()
      const { result } = renderHook(() =>
        useStoreSlice(store, selectPlayer, setPlayer),
      )
      const stateBeforeUpdate = result.current.state

      // Act — only `session` changes; `player` reference is untouched
      act(() => {
        store.setState((prev) => ({ ...prev, session: { score: 77 } }))
      })

      // Assert — selector returns the same reference → no spurious re-render
      expect(result.current.state).toBe(stateBeforeUpdate)
    })
  })
})
