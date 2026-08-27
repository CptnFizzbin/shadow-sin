import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { Label } from "#/components/ui/text/label.tsx"
import { ProfileSelectors } from "#/stores/runner/profile/profileSlice.selectors.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"

export const ReputationBuilderSection: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const streetCred = useRunnerSelector(ProfileSelectors.selectStreetCred)
  const notoriety = useRunnerSelector(ProfileSelectors.selectNotoriety)
  const publicAwarenessModifier = useRunnerSelector(ProfileSelectors.selectPublicAwarenessModifier)
  const publicAwareness = useRunnerSelector(ProfileSelectors.selectPublicAwareness)

  return (
    <BuilderSection id={BuilderSectionId.reputation}>
      <Stack direction="row">
        <TextField
          label="Street Cred"
          type="number"
          size="small"
          fullWidth
          value={streetCred}
          slotProps={{ htmlInput: { min: 0 } }}
          onChange={(e) => dispatch(Actions.profile.setStreetCred(Math.max(0, parseInt(e.target.value, 10) || 0)))}
        />
        <TextField
          label="Notoriety"
          type="number"
          size="small"
          fullWidth
          value={notoriety}
          slotProps={{ htmlInput: { min: 0 } }}
          onChange={(e) => dispatch(Actions.profile.setNotoriety(Math.max(0, parseInt(e.target.value, 10) || 0)))}
        />
        <TextField
          label="Awareness Modifier"
          type="number"
          size="small"
          fullWidth
          value={publicAwarenessModifier}
          onChange={(e) =>
            dispatch(Actions.profile.setProfilePublicAwarenessModifier(parseInt(e.target.value, 10) || 0))}
        />
      </Stack>

      <Stack sx={{ alignItems: "center" }}>
        <Label label="Public Awareness" />
        <Typography sx={{ fontWeight: "bold" }}>{publicAwareness}</Typography>
      </Stack>
    </BuilderSection>
  )
}
