import MuiTextField from "@mui/material/TextField"
import type { FC } from "react"

import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreContext,
} from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"

export const ProfileSection: FC = () => {
  const store = useCharacterBuilderStoreContext()
  const alias = useCharacterBuilderStore((state) => state.alias)
  const name = useCharacterBuilderStore((state) => state.name)

  return (
    <>
      <MuiTextField
        label="Alias"
        fullWidth
        variant="outlined"
        size="small"
        value={alias}
        onChange={(event) =>
          store.setState((prev) => ({ ...prev, alias: event.target.value }))
        }
      />

      <MuiTextField
        label="Name"
        fullWidth
        variant="outlined"
        size="small"
        value={name}
        onChange={(event) =>
          store.setState((prev) => ({ ...prev, name: event.target.value }))
        }
      />
    </>
  )
}
