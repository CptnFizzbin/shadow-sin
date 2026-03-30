import Button from "@mui/material/Button"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"
import { useState } from "react"

import { useCharacterSheetContext } from "#/components/Character/CharacterSheetProvider.tsx"
import { useAllAlerts } from "#/components/CharacterBuilder/Hooks/UseAllAlerts.ts"
import { localCharacterManager } from "#/lib/storage/local-storage/LocalCharacterManager.ts"

export const SaveCharacterButton: FC = () => {
  const store = useCharacterSheetContext()
  const navigate = useNavigate()
  const [isSaving, setIsSaving] = useState(false)

  const isValid = useAllAlerts()
    .filter((status) => status.severity === "error")
    .length === 0

  const handleSave = async () => {
    const character = store.get()
    setIsSaving(true)
    try {
      await localCharacterManager.saveCharacter(character)
      await navigate({ to: "/$characterId", params: { characterId: character.id } })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Button
      variant="contained"
      color="primary"
      disabled={!isValid || isSaving}
      onClick={handleSave}
    >
      Save
    </Button>
  )
}
