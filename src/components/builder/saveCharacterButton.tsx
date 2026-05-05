import Button from "@mui/material/Button"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"

import { useCharacterManager } from "#/character/characterManagerContext.tsx"
import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { NullUuid } from "#/lib/uuidUtils.ts"

import { useAllAlerts } from "./alerts/hooks/useAllAlerts.ts"

export const SaveCharacterButton: FC = () => {
  const store = useCharacterSheetContext()
  const navigate = useNavigate()
  const characterManager = useCharacterManager()

  const saveCharacter = useMutation({
    mutationFn: async () => {
      let character = store.get()

      if (character.id === NullUuid) {
        character = { ...character, id: crypto.randomUUID() }
      }

      await characterManager.saveCharacter(character)
      await navigate({ to: "/$characterId", params: { characterId: character.id } })
    },
  })

  const isValid = useAllAlerts()
    .filter((status) => status.severity === "error")
    .length === 0

  return (
    <Button
      variant="contained"
      color="primary"
      disabled={!isValid || saveCharacter.isPending}
      onClick={() => saveCharacter.mutate()}
    >
      Save
    </Button>
  )
}
