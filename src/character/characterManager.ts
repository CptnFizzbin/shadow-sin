import type { UUID } from "node:crypto"

import { AsyncDebouncer } from "@tanstack/pacer"

import type { AsyncJsonStorage, JsonValue } from "#/lib/storage/asyncStorage.ts"
import { toJsonValue } from "#/lib/storage/asyncStorage.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"
import { CharacterMetaSchema } from "#/system/characterSheet.ts"

import { applyMigrations } from "./applyMigrations.ts"
import type { CharacterId, CharacterRef } from "./characterId.ts"
import { parseCharacterId } from "./characterId.ts"
import type { SavedCharacter } from "./characterIndex.ts"
import { CharacterIndexSchema } from "./characterIndex.ts"
import type { CharacterLoadError } from "./characterLoadError.ts"
import { CharacterNotFoundError } from "./characterNotFoundError.ts"

export { CharacterMigrationError } from "./characterMigrationError.ts"
export { CharacterNotFoundError } from "./characterNotFoundError.ts"

interface CharactersWithErrors {
  characters: Record<string, CharacterSheet>
  errors: CharacterLoadError[]
}

type CharacterSaveFn = (character: CharacterSheet) => Promise<void>

export class CharacterManager {
  private readonly sources: Record<string, AsyncJsonStorage>
  private readonly debouncers = new Map<string, AsyncDebouncer<CharacterSaveFn>>()
  private readonly saveDebounceWait: number

  public constructor(sources: Record<string, AsyncJsonStorage>, saveDebounceWait = 0) {
    this.sources = sources
    this.saveDebounceWait = saveDebounceWait
  }

  // Exposes the underlying AsyncJsonStorage for a given source name.
  public getSource(source: string): AsyncJsonStorage | undefined {
    return this.sources[source]
  }

  // Saves the character to the source identified by character.id.
  // Updates the "index" key on that source with id, name, and lastModified.
  public async saveCharacter(character: CharacterSheet): Promise<void> {
    const ref = parseCharacterId(character.id)
    const storage = this.requireSource(ref.source)
    await storage.setJson(this.characterKey(character.id as UUID), toJsonValue(character))
    await this.upsertIndex(ref.source, {
      id: character.id,
      name: character.profile.alias,
      lastModified: new Date().toISOString(),
    })
  }

  // Debounced save — writes to underlying storage after saveDebounceWait ms.
  // Use for reactive auto-save subscriptions.
  public save(character: CharacterSheet): Promise<void> {
    return this.getOrCreateDebouncer(character.id).maybeExecute(character) as Promise<void>
  }

  // Loads and migrates a character by CharacterId.
  // Throws CharacterNotFoundError if missing.
  // Accepts a plain UUID string and coerces it to a "local" CharacterId for
  // backward-compatibility.
  public async getCharacter(id: CharacterId | CharacterRef): Promise<CharacterSheet> {
    const ref = typeof id === "object" ? id : parseCharacterId(id as CharacterId)
    const storage = this.requireSource(ref.source)
    const raw = await storage.getJson<JsonValue>(this.characterKey(ref.id))

    if (raw === null) {
      throw new CharacterNotFoundError(String(id))
    }

    const preMeta = CharacterMetaSchema.parse(
      typeof raw === "object" && raw !== null && "_meta_" in (raw as object)
        ? (raw as Record<string, unknown>)._meta_
        : {},
    )
    const migrated = applyMigrations(raw as object)
    const postMeta = migrated._meta_

    if (postMeta.appliedMigrations.length > preMeta.appliedMigrations.length) {
      await this.saveCharacter(migrated)
    }

    return migrated
  }

  // Read the raw stored JSON for a character without running migrations.
  public getRawCharacter(characterId: string): Promise<JsonValue | null> {
    const ref = parseCharacterId(characterId)
    const storage = this.requireSource(ref.source)
    return storage.getJson<JsonValue>(this.characterKey(ref.id))
  }

  // Reads the "index" key from every registered source and merges the results.
  // Returns [] if no index exists on any source.
  public async listCharacters(source?: string): Promise<SavedCharacter[]> {
    const sourceNames = source ? [source] : Object.keys(this.sources)
    const results = await Promise.all(sourceNames.map((name) => this.readIndex(name)))
    return results.flat()
  }

  // Removes the character from its source storage and from that source's "index".
  // Accepts a plain UUID string (coerced to "local") for backward-compatibility.
  public async deleteCharacter(id: CharacterId | CharacterRef): Promise<void> {
    const ref = typeof id === "object" ? id : parseCharacterId(id as CharacterId)
    const storage = this.requireSource(ref.source)

    this.debouncers.get(String(ref.id))?.cancel()
    this.debouncers.delete(String(ref.id))

    await storage.removeItem(this.characterKey(ref.id))
    await this.removeFromIndex(ref.source, String(ref.id))
  }

  // Loads all characters with error tracking (for roster display).
  public async listCharactersWithErrors(): Promise<CharactersWithErrors> {
    const allSaved = await this.listCharacters()
    const results = await Promise.all(allSaved.map((saved) => this.loadCharacterSafe(saved.id)))

    const characters: Record<string, CharacterSheet> = {}
    const errors: CharacterLoadError[] = []

    for (const result of results) {
      if (!result) continue
      if ("errorMessage" in result) {
        errors.push(result)
      } else {
        characters[result.id] = result
      }
    }

    return { characters, errors }
  }

  // Ensures the given fixture characters exist in storage (seeds if missing).
  public async ensureCharacters(characters: CharacterSheet[]): Promise<CharactersWithErrors> {
    for (const character of characters) {
      const ref = parseCharacterId(character.id)
      const storage = this.requireSource(ref.source)
      const existing = await storage.getJson(this.characterKey(ref.id))
      if (!existing) {
        await this.saveCharacter(character)
      }
    }
    return this.listCharactersWithErrors()
  }

  private requireSource(source: string): AsyncJsonStorage {
    const storage = this.sources[source]
    if (!storage) {
      throw new Error(`Unknown storage source: "${source}"`)
    }
    return storage
  }

  private characterKey(id: UUID | string): string {
    return `characters/${id}`
  }

  private async readIndex(source: string): Promise<SavedCharacter[]> {
    const storage = this.requireSource(source)
    const raw = await storage.getJson<JsonValue>("index")
    if (!raw) return []
    const result = CharacterIndexSchema.safeParse(raw)
    return result.success ? result.data : []
  }

  private async writeIndex(source: string, index: SavedCharacter[]): Promise<void> {
    const storage = this.requireSource(source)
    await storage.setJson("index", toJsonValue(index))
  }

  private async upsertIndex(source: string, entry: SavedCharacter): Promise<void> {
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

  private async loadCharacterSafe(id: CharacterId): Promise<CharacterSheet | CharacterLoadError | null> {
    const idStr = String(id)
    try {
      return await this.getCharacter(id)
    } catch (error) {
      if (error instanceof Error && error.name === "CharacterNotFoundError") {
        return null
      }
      return {
        characterId: idStr,
        errorMessage: error instanceof Error ? error.message : String(error),
        rawData: null,
      }
    }
  }

  private getOrCreateDebouncer(characterId: string): AsyncDebouncer<CharacterSaveFn> {
    const existing = this.debouncers.get(characterId)
    if (existing) return existing

    const debouncer = new AsyncDebouncer<CharacterSaveFn>(
      async (character) => {
        await this.saveCharacter(character)
      },
      { wait: this.saveDebounceWait },
    )
    this.debouncers.set(characterId, debouncer)
    return debouncer
  }
}
