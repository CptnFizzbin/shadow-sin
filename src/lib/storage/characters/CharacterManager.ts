import { sort } from "fast-sort"
import semver from "semver"

import type { StorageManager } from "#/lib/storage/StorageManager.ts"
import type { StoredJsonFile } from "#/lib/storage/StorageProvider.ts"
import { migrations } from "#/lib/storage/characters/migrations/index.ts"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

export class CharacterManager {
  private readonly characterDirectoryPath = "characters"

  public constructor(private readonly storageManager: StorageManager) {}

  public async listCharacters(): Promise<Record<string, CharacterSheet>> {
    const characterFiles = await this.storageManager.listJsonFiles(
      this.characterDirectoryPath,
    )

    const storedCharacters = await Promise.all(
      characterFiles.map(({ path }) => this.loadCharacterByPath(path)),
    )

    const characters = storedCharacters.filter(
      (character): character is CharacterSheet => character !== null,
    )

    return Object.fromEntries(characters.map((character) => [character.id, character]))
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
  ): Promise<Record<string, CharacterSheet>> {
    for (const character of characters) {
      const existingCharacter = await this.getCharacter(character.id)

      if (existingCharacter) {
        continue
      }

      await this.saveCharacter(character)
    }

    return this.listCharacters()
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

  private getCharacterPath(characterId: string): string {
    return `${this.characterDirectoryPath}/${characterId}.json`
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
        characterData.version = migration.version
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
