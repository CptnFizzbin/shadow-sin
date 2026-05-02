import type { AsyncStorage } from "./asyncStorage.ts"

export interface CachedStorageOptions {
  ttlMs?: number // Read cache TTL in ms. Default: 5 minutes.
  debounceMs?: number // Write debounce per key in ms. Default: 30 seconds.
}

interface CacheEntry {
  value: string | null
  fetchedAt: number
}

interface PendingWriteEntry {
  pendingValue: string
  fetchedAt: number
}

type AnyEntry = CacheEntry | PendingWriteEntry

function isPendingWrite(entry: AnyEntry): entry is PendingWriteEntry {
  return "pendingValue" in entry
}

// Middleware that wraps any AsyncStorage to add:
// - Read-through cache (TTL-based). getItem checks the cache before hitting underlying storage.
//   Multiple concurrent getItem calls for the same key are batched into a single underlying call.
// - Write-behind debounce. setItem writes to the cache immediately and flushes to underlying
//   storage after debounceMs. Pending writes are readable from the cache before flush.
// - Shared cache across namespaces. namespace() creates a child CachedStorage that references
//   the same internal cache Map, keyed by full namespaced path to avoid collisions.
export class CachedStorage implements AsyncStorage {
  private readonly cache: Map<string, AnyEntry>
  private readonly timers: Map<string, ReturnType<typeof setTimeout>>
  private readonly inFlight: Map<string, Promise<string | null>>
  private readonly ttlMs: number
  private readonly debounceMs: number
  private readonly namespacePath: string
  private readonly underlying: AsyncStorage

  public constructor(
    storage: AsyncStorage,
    options?: CachedStorageOptions,
    sharedCache?: Map<string, AnyEntry>,
    namespacePath?: string,
  ) {
    this.underlying = storage
    this.ttlMs = options?.ttlMs ?? 5 * 60 * 1000
    this.debounceMs = options?.debounceMs ?? 30 * 1000
    this.cache = sharedCache ?? new Map()
    this.timers = new Map()
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
      if (isPendingWrite(entry)) {
        return Promise.resolve(entry.pendingValue)
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
        if (!this.cache.has(cacheKey) || !isPendingWrite(this.cache.get(cacheKey)!)) {
          this.cache.set(cacheKey, { value, fetchedAt: Date.now() })
        }
        this.inFlight.delete(cacheKey)
        return value
      })
      this.inFlight.set(cacheKey, inFlight)
    }

    return inFlight
  }

  public setItem(key: string, value: string): Promise<void> {
    const cacheKey = this.fullCacheKey(key)

    // Write to cache immediately
    this.cache.set(cacheKey, { pendingValue: value, fetchedAt: Date.now() })

    // Cancel any existing timer
    const existing = this.timers.get(cacheKey)
    if (existing !== undefined) {
      clearTimeout(existing)
    }

    // Schedule debounced flush
    const timer = setTimeout(() => {
      this.timers.delete(cacheKey)
      const currentEntry = this.cache.get(cacheKey)
      if (currentEntry !== undefined && isPendingWrite(currentEntry)) {
        void this.underlying.setItem(key, currentEntry.pendingValue).then(() => {
          // Mark as settled in cache
          const settled = this.cache.get(cacheKey)
          if (settled !== undefined && isPendingWrite(settled) && settled.pendingValue === currentEntry.pendingValue) {
            this.cache.set(cacheKey, { value: currentEntry.pendingValue, fetchedAt: Date.now() })
          }
        })
      }
    }, this.debounceMs)

    this.timers.set(cacheKey, timer)
    return Promise.resolve()
  }

  public async removeItem(key: string): Promise<void> {
    const cacheKey = this.fullCacheKey(key)

    // Cancel any pending write
    const existing = this.timers.get(cacheKey)
    if (existing !== undefined) {
      clearTimeout(existing)
      this.timers.delete(cacheKey)
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
}
