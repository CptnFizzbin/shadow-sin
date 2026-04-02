import { sort } from "fast-sort"
import semver from "semver"

import type { StorageManager } from "#/lib/storage/StorageManager.ts"
import type { StoredJsonFile } from "#/lib/storage/StorageProvider.ts"
import type { CharacterLoadError } from "#/lib/storage/characters/CharacterLoadError.ts"
import { migrations } from "#/lib/storage/characters/migrations/index.ts"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

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
      const existingCharacter = await this.getCharacter(character.id)

      if (existingCharacter) {
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

      const migrated = await this.migrateCharacter(rawData as { version: string })

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

  private async migrateCharacter(character: {
    version: string
  }): Promise<CharacterSheet> {
    let characterData = character
    let migrationPerformed = false

    const migrationsToRun = sort(migrations)
      .asc((migration) => migration.version)
      .filter((migration) => semver.gt(migration.version, characterData.version))

    for (const migration of migrationsToRun) {
      if (semver.gt(migration.version, characterData.version)) {
        characterData = await migration.up(character)
        characterData = { ...characterData, version: migration.version }
        migrationPerformed = true
      }
    }

    const playerCharacter: CharacterSheet =
      characterData as CharacterSheet

    if (migrationPerformed) {
      await this.saveCharacter(playerCharacter)
    }

    return playerCharacter
  }
}
