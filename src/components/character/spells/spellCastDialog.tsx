import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useDialogApi } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import type { SpellData } from "#/system/magic/spellData.ts"

import { SpellCastSection } from "./spellCastSection.tsx"
import { formatDrainFormula } from "./spellDrainFormula.ts"

interface SpellCastDialogProps {
  spell: SpellData
  open: boolean
  onClose: () => void
  onClosed?: () => void
}

export const SpellCastDialog: FC<SpellCastDialogProps> = ({ spell, open, onClose, onClosed }) => {
  return (
    <Dialog open={open} onClose={onClose} slotProps={{ transition: { onExited: onClosed } }} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 0 }}>{spell.name}</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
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
              </Grid>
            )}
            <Grid size={1}>
              <Label label="Drain" variant="outlined" />
              <Typography sx={{ textAlign: "center" }}>
                {formatDrainFormula(spell.drainValueMod)}
              </Typography>
            </Grid>
          </Grid>

          {spell.description && (
            <Typography color="text.secondary">
              {spell.description}
            </Typography>
          )}

          <Divider />

          <SpellCastSection key={`${spell.id}-${open}`} spell={spell} onClose={onClose} />

          <Button onClick={onClose} color="secondary" size="small">
            Close
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export interface UseSpellCastDialogProps {
  spell: SpellData
}

export const useSpellCastDialog = () => {
  const dialogApi = useDialogApi()

  return {
    open: (props: UseSpellCastDialogProps) => dialogApi.open<void>(
      (dialogProps) => (
        <SpellCastDialog
          {...dialogProps}
          spell={props.spell}
          onClose={() => dialogProps.onClose()}
        />
      ),
    ),
  }
}
