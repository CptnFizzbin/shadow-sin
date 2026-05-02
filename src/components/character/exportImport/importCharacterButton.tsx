import UploadIcon from "@mui/icons-material/Upload"
import Button from "@mui/material/Button"
import type { FC } from "react"

import { useCharacterManager } from "#/character/characterManagerContext.tsx"
import type { CharacterSheet } from "#/system/characterSheet.ts"

import { useImportConflictDialog } from "./importConflictDialog.tsx"
import { resolveConflictedCharacter } from "./importUtils.ts"
import { useYamlFileImport } from "./useYamlFileImport.ts"

interface ImportCharacterButtonProps {
  onImported?: () => void | Promise<void>
}

export const ImportCharacterButton: FC<ImportCharacterButtonProps> = ({ onImported }) => {
  const importConflictDialog = useImportConflictDialog()
  const characterManager = useCharacterManager()

  const handleParsed = async (character: CharacterSheet) => {
    let existing: CharacterSheet | null = null
    try {
      existing = await characterManager.getCharacter(character.id)
    } catch {
      // CharacterNotFoundError is expected when the character doesn't exist
    }

    const characterToSave = existing
      ? await resolveConflictedCharacter(character, existing, importConflictDialog, characterManager)
      : character

    if (characterToSave !== null) {
      await characterManager.saveCharacter(characterToSave)
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
