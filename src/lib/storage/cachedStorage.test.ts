import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import type { AsyncStorage } from "./asyncStorage.ts"
import { CachedStorageAdaptor } from "./cachedStorage.ts"
import { StorageView } from "./storageView.ts"

const FIVE_SECONDS = 5_000

function makeTestAsyncStorage(): { storage: AsyncStorage, getRaw: (key: string) => string | null } {
  const map = new Map<string, string>()

  function makeAtPrefix(prefix: string): AsyncStorage {
    const fullKey = (key: string): string => (prefix ? `${prefix}/${key}` : key)
    return {
      hasKey: (key) => Promise.resolve(map.has(fullKey(key))),
      getItem: (key) => Promise.resolve(map.get(fullKey(key)) ?? null),
      setItem: (key, value) => (map.set(fullKey(key), value), Promise.resolve()),
      removeItem: (key) => (map.delete(fullKey(key)), Promise.resolve()),
      namespace: (ns) => makeAtPrefix(fullKey(ns)),
    }
  }

  return { storage: makeAtPrefix(""), getRaw: (key) => map.get(key) ?? null }
}

describe("CachedStorageAdaptor", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe("namespace cache sharing", () => {
    it("returns a StorageView when namespacing; writes through slice are immediately visible via root and vice versa", async () => {
      // Arrange
      const { storage: backingStore } = makeTestAsyncStorage()
      const root = new CachedStorageAdaptor(backingStore, { debounceMs: FIVE_SECONDS, ttlMs: 60_000 })
      const slice = root.namespace("key")

      // Assert namespace() returns a StorageView, not a new CachedStorageAdaptor
      expect(slice).toBeInstanceOf(StorageView)
      expect(slice).not.toBeInstanceOf(CachedStorageAdaptor)

      // Act
      await slice.setItem("one", "from-slice")

      // Assert
      expect(await slice.getItem("one")).toBe("from-slice")
      expect(await root.getItem("key/one")).toBe("from-slice")

      // Act: write through root
      await root.setItem("key/one", "from-root")

      // Assert: slice sees the root write
      expect(await slice.getItem("one")).toBe("from-root")
      expect(await root.getItem("key/one")).toBe("from-root")
    })

    it("cross-namespace writes share the debounce timer; the most recent value is flushed to backing storage after the debounce period", () => {
      // Arrange
      const { storage: backingStore, getRaw } = makeTestAsyncStorage()
      const root = new CachedStorageAdaptor(backingStore, { debounceMs: FIVE_SECONDS, ttlMs: 60_000 })
      const slice = root.namespace("key")

      // Act — three writes to the same logical key, interleaved between root and slice
      void root.setItem("key/one", "this is 1") // t=0  debounce scheduled for t=5
      vi.advanceTimersByTime(1_000) // t=1
      void slice.setItem("one", "this is 2") //      debounce reset for t=6
      vi.advanceTimersByTime(2_000) // t=3
      void root.setItem("key/one", "this is 3") //      debounce reset for t=8

      // t=4 — debounce has not fired yet
      vi.advanceTimersByTime(1_000)
      expect(getRaw("key/one")).toBeNull()

      // t=6 — still not flushed; last write was at t=3, so debounce fires at t=8
      vi.advanceTimersByTime(2_000)
      expect(getRaw("key/one")).toBeNull()

      // t=8 — debounce fires; most recent value 'this is 3' is written to backing storage
      vi.advanceTimersByTime(2_000)
      expect(getRaw("key/one")).toBe("this is 3")
    })

    it("reads via root and slice return the most recent value from shared cache before and after flush", async () => {
      // Arrange
      const { storage: backingStore } = makeTestAsyncStorage()
      const root = new CachedStorageAdaptor(backingStore, { debounceMs: FIVE_SECONDS, ttlMs: 60_000 })
      const slice = root.namespace("key")

      // Act
      void root.setItem("key/one", "this is 1")
      vi.advanceTimersByTime(1_000)
      void slice.setItem("one", "this is 2")
      vi.advanceTimersByTime(2_000)
      void root.setItem("key/one", "this is 3")

      // Assert before flush — both views return the cached value
      expect(await slice.getItem("one")).toBe("this is 3")
      expect(await root.getItem("key/one")).toBe("this is 3")

      // Advance to flush (t=8)
      vi.advanceTimersByTime(5_000)

      // Assert after flush — both views still return the cached value
      expect(await slice.getItem("one")).toBe("this is 3")
      expect(await root.getItem("key/one")).toBe("this is 3")
    })

    it("flushes correctly when the slice is the most recent writer", () => {
      // Arrange
      const { storage: backingStore, getRaw } = makeTestAsyncStorage()
      const root = new CachedStorageAdaptor(backingStore, { debounceMs: FIVE_SECONDS, ttlMs: 60_000 })
      const slice = root.namespace("key")

      // Act — root writes first, slice writes last
      void root.setItem("key/one", "root-value")
      vi.advanceTimersByTime(1_000)
      void slice.setItem("one", "slice-value") // this is the most recent write

      // Advance to flush (t=1 + 5s = t=6)
      vi.advanceTimersByTime(5_000)

      // Assert — the slice's value ends up in backing storage at the correct key
      expect(getRaw("key/one")).toBe("slice-value")
    })

    it("does not write to backing storage before the debounce period ends", () => {
      // Arrange
      const { storage: backingStore, getRaw } = makeTestAsyncStorage()
      const root = new CachedStorageAdaptor(backingStore, { debounceMs: FIVE_SECONDS, ttlMs: 60_000 })
      const slice = root.namespace("key")

      // Act
      void root.setItem("key/one", "value")
      void slice.setItem("one", "value")

      // Assert — nothing written yet
      vi.advanceTimersByTime(4_999)
      expect(getRaw("key/one")).toBeNull()

      // Advance past the debounce
      vi.advanceTimersByTime(1)
      expect(getRaw("key/one")).toBe("value")
    })
  })
})
