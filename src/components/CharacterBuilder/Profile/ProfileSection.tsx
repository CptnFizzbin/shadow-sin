import MuiTextField from "@mui/material/TextField"
import type { FC } from "react"

import { useBuilderProfileApi } from "#/components/CharacterBuilder/Profile/UseProfileApi.ts"

export const ProfileSection: FC = () => {
  const { name, alias, setName, setAlias } = useBuilderProfileApi()

  return (
    <>
      <MuiTextField
        label="Alias"
        fullWidth
        variant="outlined"
        size="small"
        value={alias}
        onChange={(event) => setAlias(event.target.value)}
      />

      <MuiTextField
        label="Name"
        fullWidth
        variant="outlined"
        size="small"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
    </>
  )
}
