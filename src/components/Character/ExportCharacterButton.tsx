import DownloadIcon from "@mui/icons-material/Download"
import Button from "@mui/material/Button"
import type { FC } from "react"

<<<<<<<< HEAD:src/components/CharacterBuilder/export-character-button.tsx
import { useCharacterSheetContext } from "#/components/Character/character-sheet-provider.tsx"
import { characterSheetToYaml, downloadTextFile } from "#/components/CharacterBuilder/export-utils.ts"
========
import { useCharacterSheetContext } from "#/components/Character/CharacterSheetProvider.tsx"
import { characterSheetToYaml, downloadTextFile } from "#/components/Character/ExportUtils.ts"
>>>>>>>> origin/shadowrun-4e:src/components/Character/ExportCharacterButton.tsx

export const ExportCharacterButton: FC = () => {
  const store = useCharacterSheetContext()

  const handleExport = () => {
    const characterSheet = store.get()
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
