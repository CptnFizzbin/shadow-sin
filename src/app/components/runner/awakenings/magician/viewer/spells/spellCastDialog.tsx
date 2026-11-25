import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { MarkdownText } from "#/components/ui/text/markdownText.tsx"
import { useDialog } from "#/hooks/ui/dialog/useDialog.tsx"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { SpellsSelectors } from "#/state/runner/spells/spells.selector.ts"
import { isSustainable } from "#/system/formulas/magic/spellSustaining.ts"
import type { SpellData } from "#/system/model/magic/spellData.ts"

import { SpellCastSection } from "./spellCastSection.tsx"
import { formatDrainFormula } from "./spellDrainFormula.ts"
import { SpellSustainSection } from "./spellSustainSection.tsx"

interface SpellCastDialogProps extends ControlledDialogProps<void> {
  spell: SpellData
}

const SpellCastDialog: FC<SpellCastDialogProps> = ({ ctrl, spell }) => {
  const sustainable = isSustainable(spell)
  const sustainingFoci = useRunnerSelector(SpellsSelectors.selectAvailableSustainingFoci, { spellId: spell.id })
  const isSustained = useRunnerSelector(SpellsSelectors.selectById, { spellId: spell.id })?.sustained === true
  const [sustainingFocusId, setSustainingFocusId] = useState<string | null>(spell.sustainedBy ?? null)
  // Only offer a focus the Spell can still use, so a focus unbonded or stashed since never caps Force.
  const sustainingFocus = sustainable
    ? sustainingFoci.find((focus) => focus.id === sustainingFocusId)
    : undefined

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="sm" onClose={false}>
      <Dialog.Title>{spell.name}</Dialog.Title>
      <Dialog.Content>
        <Stack sx={{ gap: 1.5 }}>
          <Grid container spacing={1} columns={3}>
            <Grid size={1}>
              <Label label="Category" variant="outlined" />
              <Typography sx={{ textAlign: "center" }}>
                {spell.category}
              </Typography>
            </Grid>
            <Grid size={1}>
              <Label label="Type" variant="outlined" />
              <Typography sx={{ textAlign: "center" }}>
                {spell.type}
              </Typography>
            </Grid>
            <Grid size={1}>
              <Label label="Range" variant="outlined" />
              <Typography sx={{ textAlign: "center" }}>
                {spell.range}
              </Typography>
            </Grid>
            <Grid size={1}>
              <Label label="Duration" variant="outlined" />
              <Typography sx={{ textAlign: "center" }}>
                {spell.duration}
              </Typography>
            </Grid>
            {spell.dealsDamage && (
              <Grid size={1}>
                <Label label="Damage" variant="outlined" />
                <Typography sx={{ textAlign: "center" }}>
                  {spell.damage}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", textAlign: "center", fontStyle: "italic" }}
                >
                  DV = Force
                </Typography>
              </Grid>
            )}
            <Grid size={1}>
              <Label label="Drain" variant="outlined" />
              <Typography sx={{ textAlign: "center" }}>
                {formatDrainFormula(spell)}
              </Typography>
            </Grid>
          </Grid>

          {spell.description && (
            <MarkdownText color="text.secondary">{spell.description}</MarkdownText>
          )}

          <Divider />

          <SpellCastSection
            key={spell.id}
            spell={spell}
            onClose={() => ctrl.close()}
            sustainingFoci={sustainable ? sustainingFoci : []}
            sustainingFocus={sustainingFocus}
            onSustainingFocusChange={setSustainingFocusId}
            sustainingFocusLocked={isSustained}
          />

          {sustainable && (
            <>
              <Divider />
              <SpellSustainSection spellId={spell.id} sustainingFocusId={sustainingFocus?.id ?? null} />
            </>
          )}

          <Button onClick={() => ctrl.close()} color="secondary" size="small">
            Close
          </Button>
        </Stack>
      </Dialog.Content>
    </ControlledDialog>
  )
}

interface UseSpellCastDialogProps {
  spell: SpellData
}

export const useSpellCastDialog = () => useDialog<void, UseSpellCastDialogProps>(
  (ctrl, props) => <SpellCastDialog ctrl={ctrl} spell={props.spell} />,
)
