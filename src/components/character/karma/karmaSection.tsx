import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { useCharacterSheetSelector } from "#/components/character/sheet/characterSheet.selectors.ts"
import { useSpellFormDialog } from "#/components/character/spells/dialogs/spellFormDialog.tsx"
import { isMagician } from "#/components/character/spells/spellsUtils.ts"
import { useSpellsStore } from "#/components/character/spells/useSpellsStore.ts"
import { Label } from "#/components/ui/text/label.tsx"

import { useAddKarmaDialog } from "./addKarmaDialog.tsx"
import { selectCurrentKarma, selectTotalKarma } from "./karmaSelectors.ts"
import { useSpendKarmaDialog } from "./spendKarmaDialog.tsx"
import { useKarmaStore } from "./useKarmaStore.ts"

export const KarmaSection: FC = () => {
  const addKarmaDialog = useAddKarmaDialog()
  const spendKarmaDialog = useSpendKarmaDialog()
  const karmaStore = useKarmaStore()
  const spellsStore = useSpellsStore()
  const spellFormDialog = useSpellFormDialog()
  const currentKarma = useSelector(karmaStore, selectCurrentKarma)
  const totalKarma = useSelector(karmaStore, selectTotalKarma)
  const awakeningType = useCharacterSheetSelector((sheet) => sheet.biology.awakening)

  const handleOpenAddKarma = () => {
    addKarmaDialog.open()
  }

  const handleOpenSpendKarma = () => {
    spendKarmaDialog.open({
      onNewSpell: isMagician(awakeningType)
        ? () => {
            spellFormDialog.open().then((spell) => {
              if (spell) spellsStore.save(spell)
            })
          }
        : undefined,
    })
  }

  return (
    <Grid container columns={2} spacing={1} sx={{ margin: "auto" }}>
      <Grid size={1}>
        <Stack sx={{ gap: 1, alignItems: "center" }}>
          <Label label="Current" />
          <Typography sx={{ fontWeight: "bold" }}>
            {currentKarma}
          </Typography>
        </Stack>
      </Grid>

      <Grid size={1}>
        <Stack sx={{ gap: 1, alignItems: "center" }}>
          <Label label="Total Earned" />
          <Typography sx={{ fontWeight: "bold" }}>
            {totalKarma}
          </Typography>
        </Stack>
      </Grid>

      <Grid size={1}>
        <Button size="small" variant="outlined" onClick={handleOpenAddKarma} fullWidth>
          Add Karma
        </Button>
      </Grid>

      <Grid size={1}>
        <Button size="small" variant="outlined" onClick={handleOpenSpendKarma} fullWidth>
          Spend Karma
        </Button>
      </Grid>
    </Grid>
  )
}
