import { localCharacterManager } from "#/lib/storage/localStorage/localCharacterManager.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"

import type { useImportConflictDialog } from "./importConflictDialog.tsx"

/**
 * Find the next available alias by appending an incrementing number.
 * E.g. "Artemis" → "Artemis 2" → "Artemis 3" … until no existing character
 * uses that alias.
 */
export function resolveAlias(
  baseAlias: string,
  existingAliases: Set<string>,
): string {
  let counter = 2
  let candidate = `${baseAlias} ${counter}`
  while (existingAliases.has(candidate)) {
    counter++
    candidate = `${baseAlias} ${counter}`
  }
  return candidate
}

/**
 * Shows the conflict dialog and returns the character to save, or null if the
 * user dismissed the dialog without making a choice.
 */
export async function resolveConflictedCharacter(
  character: CharacterSheet,
  existing: CharacterSheet,
  importConflictDialog: ReturnType<typeof useImportConflictDialog>,
): Promise<CharacterSheet | null> {
  const choice = await importConflictDialog.open({
    incomingCharacter: character,
    existingCharacter: existing,
  }).result()

  if (choice === "overwrite") {
    return character
  }

  if (choice === "create-new") {
    const allCharacters = await localCharacterManager.listCharacters()
    const existingAliases = new Set(
      Object.values(allCharacters).map((c) => c.profile.alias),
    )
    const newAlias = resolveAlias(character.profile.alias, existingAliases)
    return {
      ...character,
      id: crypto.randomUUID(),
      profile: { ...character.profile, alias: newAlias },
    }
  }

  return null
}
