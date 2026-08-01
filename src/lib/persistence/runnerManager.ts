import type { UUID } from "node:crypto"

import { AsyncDebouncer } from "@tanstack/pacer"

import { applyMigrations } from "#/data/applyMigrations.ts"
import { RunnerNotFoundError } from "#/lib/errors/runnerNotFoundError.ts"
import type { JsonValue } from "#/lib/jsonUtils.ts"
import { toJsonValue } from "#/lib/jsonUtils.ts"
import type { AsyncJsonStorage } from "#/lib/storage/asyncStorage.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { RunnerMetaSchema } from "#/system/runnerData.ts"

import type { RunnerId, RunnerRefLegacyPlaceholder } from "./runnerId.ts"
import { parseRunnerId } from "./runnerId.ts"
import type { RunnerRef } from "./runnerIndex.ts"
import { RunnerIndexSchema } from "./runnerIndex.ts"
import type { RunnerLoadError } from "./runnerLoadError.ts"

interface RunnersWithErrors {
  runners: Record<string, RunnerData>
  errors: RunnerLoadError[]
}

type RunnerSaveFn = (runner: RunnerData) => Promise<void>

export class RunnerManager {
  private readonly sources: Record<string, AsyncJsonStorage>
  private readonly debouncers = new Map<string, AsyncDebouncer<RunnerSaveFn>>()
  private readonly saveDebounceWait: number

  public constructor(sources: Record<string, AsyncJsonStorage>, saveDebounceWait = 0) {
    this.sources = sources
    this.saveDebounceWait = saveDebounceWait
  }

  public async saveRunner(runner: RunnerData): Promise<void> {
    const ref = parseRunnerId(runner.id)
    const storage = this.requireSource(ref.source)
    await storage.setItem(this.runnerKey(runner.id as UUID), toJsonValue(runner))
    await this.upsertIndex(ref.source, {
      id: runner.id,
      name: runner.profile.alias,
      lastModified: new Date().toISOString(),
    })
  }

  // called on the RunnerManagerContext instance in src/routes/_viewer/$runnerId.tsx
  // fallow-ignore-next-line unused-class-member
  public save(runner: RunnerData): Promise<void> {
    return this.getOrCreateDebouncer(runner.id).maybeExecute(runner) as Promise<void>
  }

  public async getRunner(id: RunnerId | RunnerRefLegacyPlaceholder): Promise<RunnerData> {
    const ref = typeof id === "object" ? id : parseRunnerId(id as RunnerId)
    const storage = this.requireSource(ref.source)
    const raw = await storage.getItem<JsonValue>(this.runnerKey(ref.id))

    if (raw === null) {
      throw new RunnerNotFoundError(String(id))
    }

    const preMeta = RunnerMetaSchema.parse(
      typeof raw === "object" && raw !== null && "_meta_" in (raw as object)
        ? (raw as Record<string, unknown>)._meta_
        : {},
    )
    const migrated = applyMigrations(raw as object)
    const postMeta = migrated._meta_

    if (postMeta.appliedMigrations.length > preMeta.appliedMigrations.length) {
      await this.saveRunner(migrated)
    }

    return migrated
  }

  // called on the RunnerManagerContext instance in importRunnerButton.tsx
  // fallow-ignore-next-line unused-class-member
  public async findRunner(id: RunnerId | RunnerRefLegacyPlaceholder): Promise<RunnerData | null> {
    try {
      return await this.getRunner(id)
    } catch (error) {
      if (error instanceof RunnerNotFoundError) return null
      throw error
    }
  }

  // called on the RunnerManagerContext instance in runnerErrorRoute.tsx
  // fallow-ignore-next-line unused-class-member
  public getRawRunner(runnerId: string): Promise<JsonValue | null> {
    const ref = parseRunnerId(runnerId)
    const storage = this.requireSource(ref.source)
    return storage.getItem<JsonValue>(this.runnerKey(ref.id))
  }

  public async listRunners(source?: string): Promise<RunnerRef[]> {
    const sourceNames = source ? [source] : Object.keys(this.sources)
    const results = await Promise.all(sourceNames.map((name) => this.readIndex(name)))
    return results.flat()
  }

  public async deleteRunner(id: RunnerId | RunnerRefLegacyPlaceholder): Promise<void> {
    const ref = typeof id === "object" ? id : parseRunnerId(id as RunnerId)
    const storage = this.requireSource(ref.source)

    this.debouncers.get(String(ref.id))?.cancel()
    this.debouncers.delete(String(ref.id))

    await storage.removeItem(this.runnerKey(ref.id))
    await this.removeFromIndex(ref.source, String(ref.id))
  }

  public async listRunnersWithErrors(): Promise<RunnersWithErrors> {
    const allSaved = await this.listRunners()
    const results = await Promise.all(allSaved.map((saved) => this.loadRunnerSafe(saved.id)))

    const runners: Record<string, RunnerData> = {}
    const errors: RunnerLoadError[] = []

    for (const result of results) {
      if (!result) continue
      if ("errorMessage" in result) {
        errors.push(result)
      } else {
        runners[result.id] = result
      }
    }

    return { runners, errors }
  }

  public async ensureRunners(runners: RunnerData[]): Promise<RunnersWithErrors> {
    for (const runner of runners) {
      const ref = parseRunnerId(runner.id)
      const storage = this.requireSource(ref.source)
      const existing = await storage.getItem(this.runnerKey(ref.id))
      if (!existing) {
        await this.saveRunner(runner)
      }
    }
    return this.listRunnersWithErrors()
  }

  private requireSource(source: string): AsyncJsonStorage {
    const storage = this.sources[source]
    if (!storage) {
      throw new Error(`Unknown storage source: "${source}"`)
    }
    return storage
  }

  private runnerKey(id: UUID | string): string {
    return `characters/${id}`
  }

  private async readIndex(source: string): Promise<RunnerRef[]> {
    const storage = this.requireSource(source)
    const raw = await storage.getItem<JsonValue>("index")
    if (!raw) return []
    const result = RunnerIndexSchema.safeParse(raw)
    return result.success ? result.data : []
  }

  private async writeIndex(source: string, index: RunnerRef[]): Promise<void> {
    const storage = this.requireSource(source)
    await storage.setItem("index", toJsonValue(index))
  }

  private async upsertIndex(source: string, entry: RunnerRef): Promise<void> {
    const index = await this.readIndex(source)
    const existingIdx = index.findIndex((item) => item.id === entry.id)
    if (existingIdx >= 0) {
      index[existingIdx] = entry
    } else {
      index.push(entry)
    }
    await this.writeIndex(source, index)
  }

  private async removeFromIndex(source: string, id: string): Promise<void> {
    const index = await this.readIndex(source)
    const filtered = index.filter((item) => item.id !== id)
    await this.writeIndex(source, filtered)
  }

  private async loadRunnerSafe(id: RunnerId): Promise<RunnerData | RunnerLoadError | null> {
    const idStr = String(id)
    try {
      return await this.getRunner(id)
    } catch (error) {
      if (error instanceof Error && error.name === "RunnerNotFoundError") {
        return null
      }
      return {
        runnerId: idStr,
        errorMessage: error instanceof Error ? error.message : String(error),
        rawData: null,
      }
    }
  }

  private getOrCreateDebouncer(runnerId: string): AsyncDebouncer<RunnerSaveFn> {
    const existing = this.debouncers.get(runnerId)
    if (existing) return existing

    const debouncer = new AsyncDebouncer<RunnerSaveFn>(
      async (runner) => {
        await this.saveRunner(runner)
      },
      { wait: this.saveDebounceWait },
    )
    this.debouncers.set(runnerId, debouncer)
    return debouncer
  }
}
