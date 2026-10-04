import ClickAwayListener from "@mui/material/ClickAwayListener"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { RiQuestionLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import { ReputationSelectors } from "#/state/runner/reputation/reputation.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

/**
 * The full-size Street Cred / Notoriety / Public Awareness readout — originally the About
 * page's own inline markup, now shared so the Adjust Reputation dialog can show the exact same
 * display above its ledger instead of a smaller, differently-styled summary.
 */
export const ReputationDisplay: FC = () => {
  const streetCred = useRunnerSelector(ReputationSelectors.selectStreetCred)
  const notoriety = useRunnerSelector(ReputationSelectors.selectNotoriety)
  const publicAwareness = useRunnerSelector(ReputationSelectors.selectPublicAwarenessInfo)
  const [descriptionOpen, setDescriptionOpen] = useState(false)

  return (
    <Grid container columns={3} spacing={1}>
      <Grid size={1}>
        <Stack sx={{ alignItems: "center" }}>
          <Label label="Street Cred" />
          <Typography>{streetCred}</Typography>
        </Stack>
      </Grid>

      <Grid size={1}>
        <Stack sx={{ alignItems: "center" }}>
          <Label label="Notoriety" />
          <Typography>{notoriety}</Typography>
        </Stack>
      </Grid>

      <Grid size={1}>
        <Stack sx={{ alignItems: "center" }}>
          <Label label="Public Awareness" />
          <Stack direction="row" sx={{ alignItems: "center" }}>
            <Typography>
              {publicAwareness.rating} - {publicAwareness.title}
            </Typography>
            {/* Click-to-toggle rather than hover so the description is reachable by tap and keyboard too */}
            <ClickAwayListener onClickAway={() => setDescriptionOpen(false)}>
              <Tooltip
                title={publicAwareness.description}
                open={descriptionOpen}
                onClose={() => setDescriptionOpen(false)}
                disableFocusListener
                disableHoverListener
                disableTouchListener
              >
                <IconButton
                  size="small"
                  aria-label={`About the ${publicAwareness.title} rank`}
                  onClick={() => setDescriptionOpen((open) => !open)}
                >
                  <RiQuestionLine size={16} />
                </IconButton>
              </Tooltip>
            </ClickAwayListener>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  )
}
