import DownloadIcon from "@mui/icons-material/Download"
import Button from "@mui/material/Button"
import type { FC } from "react"

import { useCharacterBuilderStoreContext } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import { characterSheetToYaml, downloadTextFile } from "#/components/CharacterBuilder/ExportUtils.ts"

export const ExportCharacterButton: FC = () => {
  const store = useCharacterBuilderStoreContext()

  const handleExport = () => {
    const { characterSheet } = store.get()
    const yamlContent = characterSheetToYaml(characterSheet)
    const sanitizedName =
      (characterSheet.profile.alias || characterSheet.profile.name || "character")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")

    downloadTextFile(yamlContent, `${sanitizedName}.yaml`)
  }

  return (
    <Button
      variant="outlined"
      color="info"
      size="small"
      startIcon={<DownloadIcon />}
      onClick={handleExport}
    >
      Export YAML
    </Button>
  )
}
