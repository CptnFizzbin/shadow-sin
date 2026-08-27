import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { KarmaValue } from "#/components/runner/karma/karmaValue.tsx"
import { AttrSelectors } from "#/stores/runner/attributes/attributesSlice.selectors.ts"
import { DamageSelectors } from "#/stores/runner/damage/damageSlice.selectors.ts"
import { KarmaSelectors } from "#/stores/runner/karma/karmaSlice.selectors.ts"
import { ProfileSelectors } from "#/stores/runner/profile/profileSlice.selectors.ts"
import { ReputationSelectors } from "#/stores/runner/reputation/reputationSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { AttributeLabels, AttributeOrder } from "#/system/attributeKey.ts"

/**
 * Compact, always-visible summary of the Runner currently being viewed, rendered as a second
 * row in the app header: name, attributes, damage track values, reputation, and karma.
 */
export const RunnerHeaderSummary: FC = () => {
  const displayName = useRunnerSelector(ProfileSelectors.selectDisplayName)
  const attributes = useRunnerSelector(AttrSelectors.selectAll)
  const physicalTrack = useRunnerSelector(DamageSelectors.track.physical)
  const stunTrack = useRunnerSelector(DamageSelectors.track.stun)
  const reputation = useRunnerSelector(ReputationSelectors.selectAll)
  const currentKarma = useRunnerSelector(KarmaSelectors.selectCurrent)

  const visibleAttributeKeys = AttributeOrder.filter((key) => attributes[key] !== 0)

  return (
    <Paper sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
      <Stack sx={{ padding: 1 }}>
        <Stack direction="row" sx={{ alignItems: "baseline", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: "large", fontWeight: "bold", whiteSpace: "nowrap" }}>
            {displayName}
          </Typography>

          <Stack direction="row" sx={{ alignItems: "baseline" }}>
            <Chip
              size="small"
              variant="outlined"
              label={`Rep | ${reputation.streetCred} - ${reputation.notoriety} - ${reputation.awareness.rating}`}
              sx={{ flexShrink: 0 }}
            />
            <KarmaValue amount={currentKarma} sx={{ flexShrink: 0 }} />
          </Stack>
        </Stack>

        <Stack direction="row" sx={{ justifyContent: "space-around" }}>
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
