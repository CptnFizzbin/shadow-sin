import { AsyncDebouncer } from "@tanstack/pacer"

import { applyMigrations } from "#/character/applyMigrations.ts"
import type { CharacterLoadError } from "#/character/characterLoadError.ts"
import type { StorageManager } from "#/lib/storage/storageManager.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"
import { CharacterMetaSchema } from "#/system/characterSheet.ts"

export interface CharactersWithErrors {
  characters: Record<string, CharacterSheet>
  errors: CharacterLoadError[]
}

export interface CharacterManagerOptions {
  /**
   * Debounce wait in milliseconds applied to `save()`. Rapid calls within this
   * window coalesce into a single storage write. Default: 1000.
   */
  saveDebounceWait: number
}

const defaultOptions: CharacterManagerOptions = {
  saveDebounceWait: 1000,
}

type CharacterSaveFn = (character: CharacterSheet) => Promise<void>

/**
 * Manages character persistence with an in-memory cache as the primary source
 * of truth. Storage is kept in sync asynchronously.
 *
 * - `save(character)` — writes to the in-memory store immediately and debounces
 *   the write to external storage. Safe for high-frequency callers (e.g. reactive
 *   auto-save subscriptions).
 * - `forceSave(character)` — writes to the in-memory store and immediately
 *   persists to external storage, cancelling any pending debounced write. Use
 *   when the caller must await confirmed persistence (e.g. before navigation).
 */
export class CharacterManager {
  private readonly characterDirectoryPath = "characters"

  /** In-memory cache — source of truth for all loaded/saved characters. */
  private readonly characters = new Map<string, CharacterSheet>()

  /** Per-character AsyncDebouncers used by `save()`. */
  private readonly debouncers = new Map<string, AsyncDebouncer<CharacterSaveFn>>()

  private readonly saveDebounceWait: number

  public constructor(
    private readonly storageManager: StorageManager,
    options: CharacterManagerOptions = defaultOptions,
  ) {
    this.saveDebounceWait = options.saveDebounceWait
  }

  public async listCharacters(): Promise<Record<string, CharacterSheet>> {
    const { characters } = await this.listCharactersWithErrors()
    return characters
  }

  public async listCharactersWithErrors(): Promise<CharactersWithErrors> {
    const characterFiles = await this.storageManager.listJsonFiles(
      this.characterDirectoryPath,
    )

    const results = await Promise.all(
      characterFiles.map(({ path }) => this.loadCharacterByPathSafe(path)),
    )

    const characters: Record<string, CharacterSheet> = {}
    const errors: CharacterLoadError[] = []

    for (const result of results) {
      if (!result) continue
      if ("errorMessage" in result) {
        errors.push(result)
      } else {
        characters[result.id] = result
        this.characters.set(result.id, result)
      }
    }

    return { characters, errors }
  }

  /**
   * Returns the character from the in-memory cache if available, otherwise loads
   * it from storage (running migrations if needed) and populates the cache.
   */
  public getCharacter(
    characterId: string,
  ): Promise<CharacterSheet | null> {
    const cached = this.characters.get(characterId)
    if (cached) return Promise.resolve(cached)

    return this.loadCharacterByPath(this.getCharacterPath(characterId))
  }

  /**
   * Read the raw stored JSON for a character without running migrations or
   * transformations. Returns the stored value or null if not present. This is
   * non-mutating and safe to use for exports/debugging of potentially corrupted
   * files.
   */
  public async getRawCharacter(characterId: string): Promise<unknown | null> {
    const path = this.getCharacterPath(characterId)
    const stored = await this.storageManager.loadJsonFile<unknown>(path)
    return stored ? stored.value : null
  }

  /**
   * Writes the character to the in-memory cache immediately, then schedules a
   * debounced write to external storage. Rapid successive calls coalesce into a
   * single storage write. The returned Promise resolves when the (possibly
   * delayed) write completes, or immediately if this call is displaced by a
   * newer call.
   *
   * Note: AsyncDebouncer wraps the inner function's `Promise<void>` return type
   * in an additional Promise layer, yielding `Promise<Promise<void> | undefined>`
   * in the static type. JavaScript auto-unwraps nested Promises at runtime, so
   * the awaited value is always `void | undefined`. The cast to `Promise<void>`
   * aligns the declared type with that runtime behaviour.
   */
  public save(character: CharacterSheet): Promise<void> {
    this.characters.set(character.id, character)

    return this.getOrCreateDebouncer(character.id).maybeExecute(character) as Promise<void>
  }

  /**
   * Writes the character to the in-memory cache immediately, cancels any
   * pending debounced write, and performs an immediate write to external
   * storage. The returned Promise resolves only after the storage write
   * completes.
   */
  public async forceSave(character: CharacterSheet): Promise<void> {
    this.characters.set(character.id, character)
    this.debouncers.get(character.id)?.cancel()
    await this.storageManager.saveJsonFile(
      this.getCharacterPath(character.id),
      character,
    )
  }

  public async deleteCharacter(characterId: string): Promise<void> {
    this.characters.delete(characterId)
    this.debouncers.get(characterId)?.cancel()
    this.debouncers.delete(characterId)
    await this.storageManager.deleteJsonFile(this.getCharacterPath(characterId))
  }

  public async ensureCharacters(
    characters: CharacterSheet[],
  ): Promise<CharactersWithErrors> {
    for (const character of characters) {
      const stored = await this.storageManager.loadJsonFile(this.getCharacterPath(character.id)).catch(() => null)

      if (stored) {
        continue
      }

      await this.forceSave(character)
    }

    return this.listCharactersWithErrors()
  }

  private async loadCharacterByPath(
    path: string,
  ): Promise<CharacterSheet | null> {
    const storedCharacter =
      await this.storageManager.loadJsonFile<CharacterSheet>(path)

    if (!storedCharacter) {
      return null
    }

    const character = await this.migrateCharacter(storedCharacter.value)
    this.characters.set(character.id, character)
    return character
  }

  private async loadCharacterByPathSafe(
    path: string,
  ): Promise<CharacterSheet | CharacterLoadError | null> {
    const storedCharacter = await this.storageManager.loadJsonFile<unknown>(path)

    if (!storedCharacter) {
      return null
    }

    try {
      const rawData = storedCharacter.value
      const characterId = this.extractCharacterIdFromPath(path)

      if (typeof rawData !== "object" || rawData === null) {
        return {
          characterId,
          path,
          errorMessage: "Character data is not a valid object.",
          rawData,
        }
      }

      const migrated = await this.migrateCharacter(rawData)

      if (!migrated.id || !migrated.profile) {
        return {
          characterId,
          path,
          errorMessage: "Character data is missing required fields (id or profile).",
          rawData,
        }
      }

      return migrated
    } catch (error) {
      return {
        characterId: this.extractCharacterIdFromPath(path),
        path,
        errorMessage: error instanceof Error ? error.message : String(error),
        rawData: storedCharacter.value,
      }
    }
  }

  private getCharacterPath(characterId: string): string {
    return `${this.characterDirectoryPath}/${characterId}.json`
  }

  private extractCharacterIdFromPath(path: string): string {
    const filename = path.split("/").pop() ?? path
    return filename.replace(/\.json$/, "")
  }

  private async migrateCharacter(character: object): Promise<CharacterSheet> {
    const preMeta = CharacterMetaSchema.parse("_meta_" in character ? character._meta_ : {})
    const playerCharacter = applyMigrations(character)
    const postMeta = playerCharacter._meta_

    if (postMeta.appliedMigrations.length > preMeta.appliedMigrations.length) {
      await this.storageManager.saveJsonFile(
        this.getCharacterPath(playerCharacter.id),
        playerCharacter,
      )
    }

    return playerCharacter
  }

  private getOrCreateDebouncer(characterId: string): AsyncDebouncer<CharacterSaveFn> {
    const existing = this.debouncers.get(characterId)
    if (existing) return existing

    const debouncer = new AsyncDebouncer<CharacterSaveFn>(
      async (character) => {
        await this.storageManager.saveJsonFile(
          this.getCharacterPath(character.id),
          character,
        )
      },
      { wait: this.saveDebounceWait },
    )
    this.debouncers.set(characterId, debouncer)
    return debouncer
  }
}
