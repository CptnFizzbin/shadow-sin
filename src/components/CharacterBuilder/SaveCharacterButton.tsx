import { Button } from "@mui/material"
import type { FC } from "react"

import { useAllAlerts } from "#/components/CharacterBuilder/Hooks/UseAllAlerts.ts"

export const SaveCharacterButton: FC = () => {
  const isValid = useAllAlerts()
    .filter((status) => status.severity === "error")
    .length === 0

  return (
    <Button disabled={!isValid}>Save</Button>
  )
}
