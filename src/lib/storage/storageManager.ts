import { asyncDebounce } from "@tanstack/pacer"

import type { StorageProvider, StoredJsonFile, StoredJsonFileMetadata } from "#/lib/storage/storageProvider.ts"

export interface StorageManagerOptions {
  /** Debounce wait in milliseconds applied to each `saveJsonFile` call (per path). Default: 1000. */
  saveDebounceWait: number
}

const defaultOptions: StorageManagerOptions = {
  saveDebounceWait: 1000,
}

export class StorageManager {
  // Heterogeneous map: each entry is typed as (value: unknown) => Promise<StoredJsonFile<unknown> | undefined>
  // because TypeScript cannot express a per-key generic Map. The single cast inside
  // getOrCreateSaveFn<TValue> is the only unsound point; callers always use the correctly-typed
  // public API so the runtime type is always correct.
  private readonly debouncedSaveFns = new Map<
    string,
    (value: unknown) => Promise<StoredJsonFile<unknown> | undefined>
  >()

  private readonly saveDebounceWait: number

  public constructor(
    private readonly storageProvider: StorageProvider,
    options: StorageManagerOptions = defaultOptions,
  ) {
    this.saveDebounceWait = options.saveDebounceWait
  }

  public get providerId(): string {
    return this.storageProvider.providerId
  }

  public listJsonFiles(
    pathPrefix?: string,
  ): Promise<StoredJsonFileMetadata[]> {
    return this.storageProvider.listJsonFiles(pathPrefix)
  }

  public loadJsonFile<TValue>(
    path: string,
  ): Promise<StoredJsonFile<TValue> | null> {
    return this.storageProvider.loadJsonFile<TValue>(path)
  }

  public saveJsonFile<TValue>(
    path: string,
    value: TValue,
  ): Promise<StoredJsonFile<TValue> | undefined> {
    return this.getOrCreateSaveFn<TValue>(path)(value)
  }

  public deleteJsonFile(path: string): Promise<void> {
    return this.storageProvider.deleteJsonFile(path)
  }

  private getOrCreateSaveFn<TValue>(
    path: string,
  ): (value: TValue) => Promise<StoredJsonFile<TValue> | undefined> {
    if (!this.debouncedSaveFns.has(path)) {
      // asyncDebounce infers ReturnType<TFn> as Promise<StoredJsonFile<TValue>> (because the
      // wrapped function is itself async), producing a double-Promise in the static type.
      // At runtime asyncDebounce always awaits the inner promise, so the resolved value is
      // StoredJsonFile<TValue> | undefined — matching the cast below.
      const debouncedFn = asyncDebounce(
        (content: TValue): Promise<StoredJsonFile<TValue>> =>
          this.storageProvider.saveJsonFile(path, content),
        { wait: this.saveDebounceWait },
      ) as unknown as (value: TValue) => Promise<StoredJsonFile<TValue> | undefined>

      this.debouncedSaveFns.set(
        path,
        debouncedFn as (value: unknown) => Promise<StoredJsonFile<unknown> | undefined>,
      )
    }

    return this.debouncedSaveFns.get(path) as (value: TValue) => Promise<StoredJsonFile<TValue> | undefined>
  }
}
