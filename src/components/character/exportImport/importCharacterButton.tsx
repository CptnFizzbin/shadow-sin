import UploadIcon from "@mui/icons-material/Upload"
import Button from "@mui/material/Button"
import type { FC } from "react"

import { localCharacterManager } from "#/lib/storage/localStorage/localCharacterManager.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"

import { useImportConflictDialog } from "./importConflictDialog.tsx"
import { resolveConflictedCharacter } from "./importUtils.ts"
import { useYamlFileImport } from "./useYamlFileImport.ts"

interface ImportCharacterButtonProps {
  onImported?: () => void | Promise<void>
}

export const ImportCharacterButton: FC<ImportCharacterButtonProps> = ({ onImported }) => {
  const importConflictDialog = useImportConflictDialog()

  const handleParsed = async (character: CharacterSheet) => {
    const existing = await localCharacterManager.getCharacter(character.id)
    const characterToSave = existing
      ? await resolveConflictedCharacter(character, existing, importConflictDialog)
      : character

    if (characterToSave !== null) {
      await localCharacterManager.forceSave(characterToSave)
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
