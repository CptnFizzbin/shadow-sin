import { milliseconds } from "date-fns"

import type { AsyncStorage } from "./asyncStorage.ts"

export interface CachedStorageOptions {
  ttlMs?: number // Read cache TTL in ms. Default: 5 minutes.
  debounceMs?: number // Write debounce per key in ms. Default: 30 seconds.
}

interface CacheEntry {
  // Current value: the pending write value when savePending is true,
  // or the last fetched value otherwise.
  value: string | null
  fetchedAt: number
  // True when a write is buffered and has not yet been flushed to underlying storage.
  savePending: boolean
  // Timer handle for the debounced flush, present only when savePending is true.
  timeoutId: ReturnType<typeof setTimeout> | undefined
}

// Middleware that wraps any AsyncStorage to add:
// - Read-through cache (TTL-based). getItem checks the cache before hitting underlying storage.
//   Multiple concurrent getItem calls for the same key are batched into a single underlying call.
// - Write-behind debounce. setItem writes to the cache immediately and flushes to underlying
//   storage after debounceMs. Pending writes are readable from the cache before flush.
// - Shared cache across namespaces. namespace() creates a child CachedStorage that references
//   the same internal cache Map, keyed by full namespaced path to avoid collisions.
export class CachedStorage implements AsyncStorage {
  private readonly cache: Map<string, CacheEntry>
  private readonly inFlight: Map<string, Promise<string | null>>
  private readonly ttlMs: number
  private readonly debounceMs: number
  private readonly namespacePath: string
  private readonly underlying: AsyncStorage

  public constructor(
    storage: AsyncStorage,
    options?: CachedStorageOptions,
    sharedCache?: Map<string, CacheEntry>,
    namespacePath?: string,
  ) {
    this.underlying = storage
    this.ttlMs = options?.ttlMs ?? milliseconds({ minutes: 5 })
    this.debounceMs = options?.debounceMs ?? milliseconds({ seconds: 30 })
    this.cache = sharedCache ?? new Map()
    this.inFlight = new Map()
    this.namespacePath = namespacePath ?? ""
  }

  private fullCacheKey(key: string): string {
    return this.namespacePath ? `${this.namespacePath}/${key}` : key
  }

  public async hasKey(key: string): Promise<boolean> {
    const value = await this.getItem(key)
    return value !== null
  }

  public getItem(key: string): Promise<string | null> {
    const cacheKey = this.fullCacheKey(key)
    const entry = this.cache.get(cacheKey)

    if (entry !== undefined) {
      if (entry.savePending) {
        return Promise.resolve(entry.value)
      }
      if (Date.now() - entry.fetchedAt < this.ttlMs) {
        return Promise.resolve(entry.value)
      }
    }

    // Batch concurrent calls for the same key
    let inFlight = this.inFlight.get(cacheKey)
    if (!inFlight) {
      inFlight = this.underlying.getItem(key).then((value) => {
        // Only update cache if no pending write appeared during the fetch
        const current = this.cache.get(cacheKey)
        if (current === undefined || !current.savePending) {
          this.cache.set(cacheKey, { value, fetchedAt: Date.now(), savePending: false, timeoutId: undefined })
        }
        this.inFlight.delete(cacheKey)
        return value
      }).catch((error: unknown) => {
        // Clean up so future calls retry rather than receiving the rejected promise
        this.inFlight.delete(cacheKey)
        throw error
      })
      this.inFlight.set(cacheKey, inFlight)
    }

    return inFlight
  }

  public setItem(key: string, value: string): Promise<void> {
    const cacheKey = this.fullCacheKey(key)
    const existing = this.cache.get(cacheKey)

    // Cancel any existing debounce timer
    if (existing?.timeoutId !== undefined) {
      clearTimeout(existing.timeoutId)
    }

    // Schedule debounced flush and write to cache immediately
    const timeoutId = setTimeout(() => this.flushPendingWrite(key, cacheKey), this.debounceMs)
    this.cache.set(cacheKey, { value, fetchedAt: Date.now(), savePending: true, timeoutId })

    return Promise.resolve()
  }

  public async removeItem(key: string): Promise<void> {
    const cacheKey = this.fullCacheKey(key)
    const existing = this.cache.get(cacheKey)

    // Cancel any pending write
    if (existing?.timeoutId !== undefined) {
      clearTimeout(existing.timeoutId)
    }

    this.cache.delete(cacheKey)
    await this.underlying.removeItem(key)
  }

  public namespace(ns: string): CachedStorage {
    const newPath = this.namespacePath ? `${this.namespacePath}/${ns}` : ns
    const underlyingNamespaced = this.underlying.namespace(ns)
    return new CachedStorage(
      underlyingNamespaced,
      { ttlMs: this.ttlMs, debounceMs: this.debounceMs },
      this.cache,
      newPath,
    )
  }

  private flushPendingWrite(key: string, cacheKey: string): void {
    const entry = this.cache.get(cacheKey)
    if (entry === undefined || !entry.savePending) return

    void this.underlying.setItem(key, entry.value!).then(() => {
      const current = this.cache.get(cacheKey)
      if (current !== undefined && current.savePending && current.value === entry.value) {
        this.cache.set(cacheKey, { value: entry.value, fetchedAt: Date.now(), savePending: false, timeoutId: undefined })
      }
    })
  }
}
