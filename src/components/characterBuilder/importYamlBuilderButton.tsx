import UploadIcon from "@mui/icons-material/Upload"
import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import Snackbar from "@mui/material/Snackbar"
import type { ChangeEvent, FC } from "react"
import { useRef, useState } from "react"

import { yamlToCharacterSheet } from "#/components/character/exportUtils.ts"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

interface ImportYamlBuilderButtonProps {
  onImport: (importedCharacter: CharacterSheet) => void
}

export const ImportYamlBuilderButton: FC<ImportYamlBuilderButtonProps> = ({ onImport }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [importError, setImportError] = useState(false)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Reset so the same file can be re-selected if needed
    event.target.value = ""

    const yamlContent = await file.text()

    try {
      const importedCharacter = yamlToCharacterSheet(yamlContent)
      onImport(importedCharacter)
    } catch (error) {
      console.error("Failed to parse YAML file:", error)
      setImportError(true)
    }
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
        color="info"
        size="small"
        startIcon={<UploadIcon />}
        onClick={() => inputRef.current?.click()}
      >
        Import YAML
      </Button>

      <Snackbar
        open={importError}
        autoHideDuration={6000}
        onClose={() => setImportError(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="error"
          onClose={() => setImportError(false)}
        >
          Failed to import YAML file. Please make sure the file is a valid ShadowSIN character export.
        </Alert>
      </Snackbar>
    </>
  )
}
