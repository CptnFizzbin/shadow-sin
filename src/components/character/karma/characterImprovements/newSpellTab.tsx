import AddIcon from "@mui/icons-material/Add"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useSpellFormDialog } from "#/components/character/spells/dialogs/spellFormDialog.tsx"

import { useSpendKarmaDialogContext } from "./forms/spendKarmaDialogContext.tsx"
import { NEW_SPELL_KARMA_COST } from "./improvementsKarmaCost.ts"

export const NewSpellTab: FC = () => {
  const { improvementsStore } = useSpendKarmaDialogContext()
  const spellFormDialog = useSpellFormDialog()

  const handleAddSpell = () => {
    spellFormDialog.open().then((spell) => {
      if (spell) improvementsStore.learnSpell(spell)
    })
  }

  return (
    <Stack sx={{ gap: 1 }}>
      <Typography color="text.secondary">
        Learn a new spell for <strong>{NEW_SPELL_KARMA_COST} karma</strong> each. Fill in the spell
        details for each spell you want to learn.
      </Typography>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAddSpell}
        fullWidth
      >
        Add Spell
      </Button>
    </Stack>
  )
}
