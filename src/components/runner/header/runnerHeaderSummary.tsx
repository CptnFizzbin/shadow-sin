import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { KarmaValue } from "#/components/runner/karma/karmaValue.tsx"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { AttributeLabels, AttributeOrder } from "#/system/attributeKey.ts"

/**
 * Compact, always-visible summary of the Runner currently being viewed, rendered as a second
 * row in the app header: name, attributes, damage track values, reputation, and karma.
 */
export const RunnerHeaderSummary: FC = () => {
  const displayName = useRunnerStoreSelector((state) => state.profile.alias || state.profile.name)
  const attributes = useRunnerStoreSelector(Selectors.attributes.selectAttributes)
  const physicalTrack = useRunnerStoreSelector(Selectors.damage.selectPhysicalTrack)
  const stunTrack = useRunnerStoreSelector(Selectors.damage.selectStunTrack)
  const streetCred = useRunnerStoreSelector(Selectors.profile.selectStreetCred)
  const currentKarma = useRunnerStoreSelector(Selectors.karma.selectCurrentKarma)

  const visibleAttributeKeys = AttributeOrder.filter((key) => attributes[key] !== 0)

  return (
    <Stack
      direction="row"
      divider={<Divider orientation="vertical" flexItem />}
      sx={{ alignItems: "center", gap: 1.5, overflowX: "auto", px: 2, py: 0.5 }}
    >
      <Typography sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>{displayName}</Typography>

      <Stack direction="row" sx={{ gap: 1.5 }}>
        {visibleAttributeKeys.map((key) => (
          <Typography key={key} variant="body2" sx={{ whiteSpace: "nowrap" }}>
            {AttributeLabels[key]}
            {" "}
            {attributes[key]}
          </Typography>
        ))}
      </Stack>

      <Stack direction="row" sx={{ gap: 1.5 }}>
        <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
          P
          {" "}
          {physicalTrack.current}
          /
          {physicalTrack.max}
        </Typography>
        <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
          S
          {" "}
          {stunTrack.current}
          /
          {stunTrack.max}
        </Typography>
      </Stack>

      <Chip size="small" variant="outlined" label={`Rep ${streetCred}`} sx={{ flexShrink: 0 }} />

      <KarmaValue amount={currentKarma} sx={{ flexShrink: 0 }} />
    </Stack>
  )
}
