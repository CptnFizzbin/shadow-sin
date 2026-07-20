import UploadIcon from "@mui/icons-material/Upload"
import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import Snackbar from "@mui/material/Snackbar"
import type { FC } from "react"
import { useState } from "react"

import { useYamlFileImport } from "#/components/runner/exportImport/useYamlFileImport.ts"
import type { RunnerData } from "#/system/runnerData.ts"

interface BuilderImportButtonProps {
  onImport: (importedRunner: RunnerData) => void
}

export const BuilderImportButton: FC<BuilderImportButtonProps> = ({ onImport }) => {
  const [importError, setImportError] = useState(false)

  const { inputProps, openFilePicker } = useYamlFileImport({
    onParsed: (importedRunner) => {
      onImport(importedRunner)
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
        Import
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
          Failed to import YAML file. Please make sure the file is a valid ShadowSIN runner export.
        </Alert>
      </Snackbar>
    </>
  )
}
