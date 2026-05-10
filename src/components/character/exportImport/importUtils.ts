import type { CharacterManager } from "#/character/characterManager.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"

import type { useImportConflictDialog } from "./importConflictDialog.tsx"
import { resolveAlias } from "./resolveAlias.ts"

export async function resolveConflictedCharacter(
  character: CharacterSheet,
  existing: CharacterSheet,
  importConflictDialog: ReturnType<typeof useImportConflictDialog>,
  characterManager: CharacterManager,
): Promise<CharacterSheet | null> {
  const choice = await importConflictDialog.open({
    incomingCharacter: character,
    existingCharacter: existing,
  })

  if (choice === "overwrite") {
    return character
  }

  if (choice === "create-new") {
    const allCharacters = await characterManager.listCharacters()
    const existingAliases = new Set(allCharacters.map((c) => c.name))
    const newAlias = resolveAlias(character.profile.alias, existingAliases)
    return {
      ...character,
      id: crypto.randomUUID(),
      profile: { ...character.profile, alias: newAlias },
    }
  }

  return null
}
