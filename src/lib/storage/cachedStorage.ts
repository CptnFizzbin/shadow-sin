import { Debouncer } from "@tanstack/pacer"
import { milliseconds } from "date-fns"

import type { AsyncStorage } from "./asyncStorage.ts"

export interface CachedStorageAdaptorOptions {
  ttlMs?: number
  debounceMs?: number
}

interface CacheEntry {
  value: string | null
  fetchedAt: number
  savePending: boolean
}

type FlushFn = (key: string, cacheKey: string) => void

export class CachedStorageAdaptor implements AsyncStorage {
  private readonly cache: Map<string, CacheEntry>
  private readonly debouncers: Map<string, Debouncer<FlushFn>>
  private readonly inFlight: Map<string, Promise<string | null>>
  private readonly ttlMs: number
  private readonly debounceMs: number
  private readonly namespacePath: string
  private readonly underlying: AsyncStorage

  public constructor(
    storage: AsyncStorage,
    options?: CachedStorageAdaptorOptions,
    sharedCache?: Map<string, CacheEntry>,
    sharedDebouncers?: Map<string, Debouncer<FlushFn>>,
    namespacePath?: string,
  ) {
    this.underlying = storage
    this.ttlMs = options?.ttlMs ?? milliseconds({ minutes: 5 })
    this.debounceMs = options?.debounceMs ?? milliseconds({ seconds: 30 })
    this.cache = sharedCache ?? new Map()
    this.debouncers = sharedDebouncers ?? new Map()
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
      if (entry.savePending || Date.now() - entry.fetchedAt < this.ttlMs) {
        return Promise.resolve(entry.value)
      }
    }

    let inFlight = this.inFlight.get(cacheKey)
    if (!inFlight) {
      inFlight = this.underlying.getItem(key).then((value) => {
        const current = this.cache.get(cacheKey)
        if (current === undefined || !current.savePending) {
          this.cache.set(cacheKey, { value, fetchedAt: Date.now(), savePending: false })
        }
        this.inFlight.delete(cacheKey)
        return value
      }).catch((error: unknown) => {
        this.inFlight.delete(cacheKey)
        throw error
      })
      this.inFlight.set(cacheKey, inFlight)
    }

    return inFlight
  }

  public setItem(key: string, value: string): Promise<void> {
    const cacheKey = this.fullCacheKey(key)
    this.cache.set(cacheKey, { value, fetchedAt: Date.now(), savePending: true })
    this.debouncedFlush(key, cacheKey)
    return Promise.resolve()
  }

  public async removeItem(key: string): Promise<void> {
    const cacheKey = this.fullCacheKey(key)
    this.debouncers.get(cacheKey)?.cancel()
    this.cache.delete(cacheKey)
    await this.underlying.removeItem(key)
  }

  public namespace(ns: string): CachedStorageAdaptor {
    const newPath = this.namespacePath ? `${this.namespacePath}/${ns}` : ns
    const underlyingNamespaced = this.underlying.namespace(ns)
    return new CachedStorageAdaptor(
      underlyingNamespaced,
      { ttlMs: this.ttlMs, debounceMs: this.debounceMs },
      this.cache,
      this.debouncers,
      newPath,
    )
  }

  private debouncedFlush(key: string, cacheKey: string): void {
    let debouncer = this.debouncers.get(cacheKey)
    if (!debouncer) {
      debouncer = new Debouncer<FlushFn>(
        (k, ck) => this.flushPendingWrite(k, ck),
        { wait: this.debounceMs },
      )
      this.debouncers.set(cacheKey, debouncer)
    }
    debouncer.maybeExecute(key, cacheKey)
  }

  private flushPendingWrite(key: string, cacheKey: string): void {
    const entry = this.cache.get(cacheKey)
    if (entry === undefined || !entry.savePending) return

    void this.underlying.setItem(key, entry.value!).then(() => {
      const current = this.cache.get(cacheKey)
      if (current !== undefined && current.savePending && current.value === entry.value) {
        this.cache.set(cacheKey, { value: entry.value, fetchedAt: Date.now(), savePending: false })
      }
    })
  }
}
