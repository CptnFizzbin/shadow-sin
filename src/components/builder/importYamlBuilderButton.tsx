import UploadIcon from "@mui/icons-material/Upload"
import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import Snackbar from "@mui/material/Snackbar"
import type { FC } from "react"
import { useState } from "react"

import { useYamlFileImport } from "#/components/character/exportImport/useYamlFileImport.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"

interface ImportYamlBuilderButtonProps {
  onImport: (importedCharacter: CharacterSheet) => void
}

export const ImportYamlBuilderButton: FC<ImportYamlBuilderButtonProps> = ({ onImport }) => {
  const [importError, setImportError] = useState(false)

  const { inputProps, openFilePicker } = useYamlFileImport({
    onParsed: (importedCharacter) => {
      onImport(importedCharacter)
    },
    onError: (error) => {
      console.error("Failed to parse YAML file:", error)
      setImportError(true)
    },
  })

  return (
    <>
      <input {...inputProps} />
      <Button
        variant="outlined"
        color="info"
        size="small"
        startIcon={<UploadIcon />}
        onClick={openFilePicker}
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
