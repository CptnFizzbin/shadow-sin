import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { KarmaValue } from "#/components/runner/karma/karmaValue.tsx"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { AttributeLabels, AttributeOrder } from "#/system/attributeKey.ts"

/**
 * Compact, always-visible summary of the Runner currently being viewed, rendered as a second
 * row in the app header: name, attributes, damage track values, reputation, and karma.
 */
export const RunnerHeaderSummary: FC = () => {
  const displayName = useRunnerStoreSelector(Selectors.profile.selectProfileDisplayName)
  const attributes = useRunnerStoreSelector(Selectors.attributes.selectAttributes)
  const physicalTrack = useRunnerStoreSelector(Selectors.damage.selectPhysicalTrack)
  const stunTrack = useRunnerStoreSelector(Selectors.damage.selectStunTrack)
  const streetCred = useRunnerStoreSelector(Selectors.profile.selectStreetCred)
  const currentKarma = useRunnerStoreSelector(Selectors.karma.selectCurrentKarma)

  const visibleAttributeKeys = AttributeOrder.filter((key) => attributes[key] !== 0)

  return (
    <Paper sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
      <Stack sx={{ padding: 1 }}>
        <Stack direction="row" sx={{ alignItems: "baseline", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: "large", fontWeight: "bold", whiteSpace: "nowrap" }}>
            {displayName}
          </Typography>

          <Stack direction="row" sx={{ alignItems: "baseline" }}>
            <Chip size="small" variant="outlined" label={`Rep ${streetCred}`} sx={{ flexShrink: 0 }} />
            <KarmaValue amount={currentKarma} sx={{ flexShrink: 0 }} />
          </Stack>
        </Stack>

        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          {visibleAttributeKeys.map((key) => (
            <Stack key={key} sx={{ alignItems: "center", gap: 0 }}>
              <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                {AttributeLabels[key]}
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                {attributes[key]}
              </Typography>
            </Stack>
          ))}
        </Stack>

        <Stack direction="row">
          <Chip sx={{ flex: 1 }} size="small" label={`Physical ${physicalTrack.current}/${physicalTrack.max}`} />
          <Chip sx={{ flex: 1 }} size="small" label={`Stun ${stunTrack.current}/${stunTrack.max}`} />
        </Stack>
      </Stack>
    </Paper>
  )
}
