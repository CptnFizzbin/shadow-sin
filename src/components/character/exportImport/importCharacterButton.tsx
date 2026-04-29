import UploadIcon from "@mui/icons-material/Upload"
import Button from "@mui/material/Button"
import type { FC } from "react"

import { localCharacterManager } from "#/lib/storage/localStorage/localCharacterManager.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"

import { useImportConflictDialog } from "./importConflictDialog.tsx"
import { useYamlFileImport } from "./useYamlFileImport.ts"

interface ImportCharacterButtonProps {
  onImported?: () => void | Promise<void>
}

/**
 * Find the next available alias by appending an incrementing number.
 * E.g. "Artemis" → "Artemis 2" → "Artemis 3" … until no existing character
 * uses that alias.
 */
function resolveAlias(
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

export const ImportCharacterButton: FC<ImportCharacterButtonProps> = ({ onImported }) => {
  const importConflictDialog = useImportConflictDialog()

  // fallow-ignore-next-line complexity
  const handleParsed = async (character: CharacterSheet) => {
    const existing = await localCharacterManager.getCharacter(character.id)

    if (!existing) {
      await localCharacterManager.forceSave(character)
      await onImported?.()
      return
    }

    const choice = await importConflictDialog.open({
      incomingCharacter: character,
      existingCharacter: existing,
    }).result()

    if (choice === "overwrite") {
      await localCharacterManager.forceSave(character)
      await onImported?.()
    } else if (choice === "create-new") {
      const allCharacters = await localCharacterManager.listCharacters()
      const existingAliases = new Set(
        Object.values(allCharacters).map((c) => c.profile.alias),
      )
      const newAlias = resolveAlias(character.profile.alias, existingAliases)
      const newCharacter: CharacterSheet = {
        ...character,
        id: crypto.randomUUID(),
        profile: {
          ...character.profile,
          alias: newAlias,
        },
      }
      await localCharacterManager.forceSave(newCharacter)
      await onImported?.()
    }
  }

  const { inputProps, openFilePicker } = useYamlFileImport({
    onParsed: handleParsed,
    onError: (error) => {
      console.error("Failed to parse YAML file:", error)
    },
  })

  return (
    <>
      <input {...inputProps} />
      <Button
        variant="outlined"
        startIcon={<UploadIcon />}
        onClick={openFilePicker}
      >
        Import YAML
      </Button>
    </>
  )
}
