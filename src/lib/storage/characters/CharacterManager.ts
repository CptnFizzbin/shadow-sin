import { sort } from "fast-sort"

import { compareSemver, CURRENT_CHARACTER_VERSION } from "#/lib/semver.ts"
import type { StoredJsonFile } from "#/lib/storage/IStorageProvider.ts"
import type { StorageManager } from "#/lib/storage/StorageManager.ts"
import { migrations } from "#/lib/storage/characters/migrations/index.ts"
import type { PlayerCharacterData } from "#/lib/system/types/playerCharacterData.ts"

export class CharacterManager {
  private readonly characterDirectoryPath = "characters"

  public constructor(private readonly storageManager: StorageManager) {}

  public async listCharacters(): Promise<PlayerCharacterData[]> {
    const characterFiles = await this.storageManager.listJsonFiles(
      this.characterDirectoryPath,
    )

    const storedCharacters = await Promise.all(
      characterFiles.map(async ({ path }) => this.loadCharacterByPath(path)),
    )

    return storedCharacters
      .filter(
        (character): character is PlayerCharacterData => character !== null,
      )
      .sort((firstCharacter, secondCharacter) =>
        firstCharacter.profile.alias.localeCompare(
          secondCharacter.profile.alias,
        ),
      )
  }

  public async getCharacter(
    characterId: string,
  ): Promise<PlayerCharacterData | null> {
    return this.loadCharacterByPath(this.getCharacterPath(characterId))
  }

  public async saveCharacter(
    character: PlayerCharacterData,
  ): Promise<StoredJsonFile<PlayerCharacterData>> {
    return this.storageManager.saveJsonFile(
      this.getCharacterPath(character.id),
      character,
    )
  }

  public async deleteCharacter(characterId: string): Promise<void> {
    await this.storageManager.deleteJsonFile(this.getCharacterPath(characterId))
  }

  public async ensureCharacters(
    characters: PlayerCharacterData[],
  ): Promise<PlayerCharacterData[]> {
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
  ): Promise<PlayerCharacterData | null> {
    const storedCharacter =
      await this.storageManager.loadJsonFile<PlayerCharacterData>(path)

    if (!storedCharacter) {
      return null
    }

    return this.migrateCharacter(storedCharacter.value)
  }

  private getCharacterPath(characterId: string): string {
    return `${this.characterDirectoryPath}/${characterId}.json`
  }

  private async migrateCharacter(character: {
    version: string | number
  }): Promise<PlayerCharacterData> {
    // Normalise legacy numeric versions (e.g. 0, 1) to semver strings.
    const currentVersion =
      typeof character.version === "number"
        ? `${character.version}.0.0`
        : (character.version ?? "0.0.0")

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let characterData: any = { ...character, version: currentVersion }
    let migrationPerformed = false

    const migrationsToRun = sort(migrations)
      .asc((migration) => migration.version)
      .filter(
        (migration) => compareSemver(migration.version, currentVersion) > 0,
      )

    for (const migration of migrationsToRun) {
      if (
        compareSemver(migration.version, characterData.version as string) > 0
      ) {
        characterData = await migration.up(characterData)
        characterData.version = migration.version
        migrationPerformed = true
      }
    }

    // Ensure the version is set to the current version after all migrations.
    if (characterData.version !== CURRENT_CHARACTER_VERSION) {
      characterData.version = CURRENT_CHARACTER_VERSION
      migrationPerformed = true
    }

    const playerCharacter = characterData as PlayerCharacterData

    if (migrationPerformed) {
      await this.saveCharacter(playerCharacter)
    }

    return playerCharacter
  }
}
