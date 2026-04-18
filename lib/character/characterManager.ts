import { sort } from "fast-sort"

import type { CharacterLoadError } from "#/character/characterLoadError.ts"
import { migrations } from "#/migrations.ts"
import type { StorageManager } from "#/storage/storageManager.ts"
import type { StoredJsonFile } from "#/storage/storageProvider.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"

export interface CharactersWithErrors {
  characters: Record<string, CharacterSheet>
  errors: CharacterLoadError[]
}

export class CharacterManager {
  private readonly characterDirectoryPath = "characters"

  public constructor(private readonly storageManager: StorageManager) {}

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
      }
    }

    return { characters, errors }
  }

  public getCharacter(
    characterId: string,
  ): Promise<CharacterSheet | null> {
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

  public saveCharacter(
    character: CharacterSheet,
  ): Promise<StoredJsonFile<CharacterSheet>> {
    return this.storageManager.saveJsonFile(
      this.getCharacterPath(character.id),
      character,
    )
  }

  public async deleteCharacter(characterId: string): Promise<void> {
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

      await this.saveCharacter(character)
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

    return this.migrateCharacter(storedCharacter.value)
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
    let characterData: object = character

    const existingMeta = (characterData as { _meta_?: unknown })._meta_ as
      | { version?: number, appliedMigrations?: unknown }
      | undefined

    const appliedMigrationIds: string[] = Array.isArray(existingMeta?.appliedMigrations)
      ? [...existingMeta.appliedMigrations]
      : []

    characterData = {
      ...(characterData as Record<string, unknown>),
      _meta_: { version: 1, ...(existingMeta ?? {}), appliedMigrations: [...appliedMigrationIds] },
    }

    const migrationsToRun = sort(migrations)
      .asc((migration) => migration.id)
      .filter((migration) => !appliedMigrationIds.includes(migration.id))

    let migrationPerformed = false

    for (const migration of migrationsToRun) {
      characterData = migration.up(characterData)
      appliedMigrationIds.push(migration.id)
      // Always preserve appliedMigrations regardless of what the migration did to _meta_
      const metaAfterMigration = (characterData as { _meta_?: unknown })._meta_
      characterData = {
        ...(characterData as Record<string, unknown>),
        _meta_: {
          version: 1,
          ...(typeof metaAfterMigration === "object" && metaAfterMigration !== null
            ? (metaAfterMigration as Record<string, unknown>)
            : {}),
          appliedMigrations: [...appliedMigrationIds],
        },
      }
      migrationPerformed = true
    }

    const playerCharacter = characterData as CharacterSheet

    if (migrationPerformed) {
      await this.saveCharacter(playerCharacter)
    }

    return playerCharacter
  }
}
