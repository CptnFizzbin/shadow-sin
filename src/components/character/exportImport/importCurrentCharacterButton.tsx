import UploadIcon from "@mui/icons-material/Upload"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { useCharacterSheet, useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { ConfirmDialog } from "#/components/dialogs/confirmDialog.tsx"
import type { CharacterSheet } from "#/system/characterSheet.ts"

import { useYamlFileImport } from "./useYamlFileImport.ts"

export const ImportCurrentCharacterButton: FC = () => {
  const store = useCharacterSheetContext()
  const characterName = useCharacterSheet((s) => s.profile.alias || s.profile.name)
  const [pendingCharacter, setPendingCharacter] = useState<CharacterSheet | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)

  const { inputProps, openFilePicker } = useYamlFileImport({
    onParsed: (character) => {
      setPendingCharacter(character)
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unknown error"
      setParseError(message)
    },
  })

  const handleConfirm = () => {
    if (!pendingCharacter) return
    store.set(pendingCharacter)
    setPendingCharacter(null)
  }

  const handleCancel = () => {
    setPendingCharacter(null)
  }

  return (
    <>
      <input {...inputProps} />
      <Button
        variant="outlined"
        color="warning"
        size="small"
        startIcon={<UploadIcon />}
        onClick={openFilePicker}
      >
        Import YAML
      </Button>

      {pendingCharacter !== null && (
        <ConfirmDialog
          title="Overwrite character?"
          body={(
            <Typography>
              Importing will overwrite{" "}
              <Typography component="span" sx={{ fontWeight: "bold" }}>
                {characterName}
              </Typography>{" "}
              with the imported data. This cannot be undone.
            </Typography>
          )}
          slotProps={{
            confirmButton: { label: "Overwrite", color: "warning" },
          }}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onClosed={handleCancel}
        />
      )}

      {parseError !== null && (
        <ConfirmDialog
          title="Import failed"
          body={(
            <Typography>
              The selected file could not be imported: {parseError}
            </Typography>
          )}
          slotProps={{
            confirmButton: { label: "OK", color: "primary" },
            cancelButton: { sx: { display: "none" } },
          }}
          onConfirm={() => setParseError(null)}
          onCancel={() => setParseError(null)}
          onClosed={() => setParseError(null)}
        />
      )}
    </>
  )
}
