import MuiTextField from "@mui/material/TextField"
import type { FC } from "react"

import {
  useBuilderStoreSlice,
  useBuildStateStore,
} from "#/components/CharacterBuilder/BuilderState/BuilderStateProvider.tsx"

export const ProfileSection: FC = () => {
  const storeSlice = useBuilderStoreSlice(
    (state) => state,
    (_state, newState) => newState,
  )

  const alias = useBuildStateStore((state) => state.alias)
  const name = useBuildStateStore((state) => state.name)

  return (
    <>
      <MuiTextField
        label="Alias"
        fullWidth
        variant="outlined"
        size="small"
        value={alias}
        onChange={(event) =>
          storeSlice.update((draft) => {
            draft.alias = event.target.value
          })
        }
      />

      <MuiTextField
        label="Name"
        fullWidth
        variant="outlined"
        size="small"
        value={name}
        onChange={(event) =>
          storeSlice.update((draft) => {
            draft.name = event.target.value
          })
        }
      />
    </>
  )
}
