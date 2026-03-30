import DownloadIcon from "@mui/icons-material/Download"
import Button from "@mui/material/Button"
import type { FC } from "react"

import { useCharacterBuilderStoreContext } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import {
  characterBuilderStateToYaml,
  downloadTextFile,
} from "#/components/CharacterBuilder/ExportUtils.ts"

export const ExportCharacterButton: FC = () => {
  const store = useCharacterBuilderStoreContext()

  const handleExport = () => {
    const state = store.state
    const yamlContent = characterBuilderStateToYaml(state)
    const sanitizedName =
      (state.alias || state.name || "character")
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
