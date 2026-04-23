import Button from "@mui/material/Button"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"

import { useAllAlerts } from "#/components/builder/alerts/hooks/useAllAlerts.ts"
import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { localCharacterManager } from "#/lib/storage/localStorage/localCharacterManager.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"

export const SaveCharacterButton: FC = () => {
  const store = useCharacterSheetContext()
  const navigate = useNavigate()
  const saveCharacter = useMutation({
    mutationFn: async () => {
      let character = store.get()

      if (character.id === NullUuid) {
        character = { ...character, id: crypto.randomUUID() }
      }

      await localCharacterManager.forceSave(character)
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
