import UploadIcon from "@mui/icons-material/Upload"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import type { ChangeEvent, FC } from "react"
import { useRef, useState } from "react"

import { useCharacterSheet, useCharacterSheetContext } from "#/components/character/characterSheetProvider.tsx"
import { yamlToCharacterSheet } from "#/components/character/exportUtils.ts"
import { ConfirmDialog } from "#/components/ui/dialogs/confirmDialog.tsx"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

export const ImportCurrentCharacterButton: FC = () => {
  const store = useCharacterSheetContext()
  const characterName = useCharacterSheet((s) => s.profile.alias || s.profile.name)
  const inputRef = useRef<HTMLInputElement>(null)
  const [pendingCharacter, setPendingCharacter] = useState<CharacterSheet | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Reset so the same file can be re-selected if needed
    event.target.value = ""

    const yamlContent = await file.text()
    let character: CharacterSheet

    try {
      character = yamlToCharacterSheet(yamlContent)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      setParseError(message)
      return
    }

    setPendingCharacter(character)
  }

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
      <input
        ref={inputRef}
        type="file"
        accept=".yaml,.yml"
        style={{ display: "none" }}
        onChange={(event) => { void handleFileChange(event) }}
      />
      <Button
        variant="outlined"
        color="warning"
        size="small"
        startIcon={<UploadIcon />}
        onClick={() => inputRef.current?.click()}
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
