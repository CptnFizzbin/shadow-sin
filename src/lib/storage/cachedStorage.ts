import { Debouncer } from "@tanstack/pacer"
import { milliseconds } from "date-fns"

import type { AsyncStorage } from "./asyncStorage.ts"
import { StorageView } from "./storageView.ts"

export interface CachedStorageAdaptorOptions {
  ttlMs?: number
  debounceMs?: number
}

interface CacheEntry {
  readonly value: string | null
  fetchedAt: Date
  savePending: boolean
  debouncer?: Debouncer<() => void>
}

export class CachedStorageAdaptor implements AsyncStorage {
  private readonly cache: Map<string, CacheEntry>
  private readonly inFlight: Map<string, Promise<string | null>>
  private readonly ttlMs: number
  private readonly debounceMs: number
  private readonly underlying: AsyncStorage

  public constructor(
    storage: AsyncStorage,
    options?: CachedStorageAdaptorOptions,
  ) {
    this.underlying = storage
    this.ttlMs = options?.ttlMs ?? milliseconds({ minutes: 5 })
    this.debounceMs = options?.debounceMs ?? milliseconds({ seconds: 30 })
    this.cache = new Map()
    this.inFlight = new Map()
  }

  public async hasKey(key: string): Promise<boolean> {
    const value = await this.getItem(key)
    return value !== null
  }

  public getItem(key: string): Promise<string | null> {
    const entry = this.cache.get(key)

    if (entry !== undefined) {
      if (entry.savePending || Date.now() - entry.fetchedAt.getTime() < this.ttlMs) {
        return Promise.resolve(entry.value)
      }
    }

    let inFlight = this.inFlight.get(key)
    if (!inFlight) {
      inFlight = this.underlying.getItem(key).then((value) => {
        const current = this.cache.get(key)
        if (current === undefined || !current.savePending) {
          this.cache.set(key, { value, fetchedAt: new Date(), savePending: false })
        }
        this.inFlight.delete(key)
        return value
      }).catch((error: unknown) => {
        this.inFlight.delete(key)
        throw error
      })
      this.inFlight.set(key, inFlight)
    }

    return inFlight
  }

  public setItem(key: string, value: string): Promise<void> {
    const existing = this.cache.get(key)
    let debouncer = existing?.debouncer
    if (!debouncer) {
      debouncer = new Debouncer<() => void>(() => this.flushPendingWrite(key), { wait: this.debounceMs })
    }
    this.cache.set(key, { value, fetchedAt: new Date(), savePending: true, debouncer })
    debouncer.maybeExecute()
    return Promise.resolve()
  }

  public async removeItem(key: string): Promise<void> {
    this.cache.get(key)?.debouncer?.cancel()
    this.cache.delete(key)
    await this.underlying.removeItem(key)
  }

  public namespace(ns: string): StorageView {
    return new StorageView(this, ns)
  }

  private flushPendingWrite(key: string): void {
    const entry = this.cache.get(key)
    if (!entry?.savePending) return

    void this.underlying.setItem(key, entry.value!).then(() => {
      const current = this.cache.get(key)
      if (current !== undefined && current.savePending && current.value === entry.value) {
        this.cache.set(key, { ...current, fetchedAt: new Date(), savePending: false })
      }
    })
  }
}
