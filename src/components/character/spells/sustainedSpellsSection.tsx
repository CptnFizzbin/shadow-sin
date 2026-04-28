import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { produce } from "immer"
import type { FC } from "react"

import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import type { SpellData } from "#/system/magic/spellData.ts"

import { formatDrainFormula } from "./spellDrainFormula.ts"
import { useSpellsStore } from "./useSpellsStore.ts"

export const SustainedSpellsSection: FC = () => {
  const sustainedSpells = useCharacterSheet(
    (sheet) => sheet.spells.filter((s) => s.sustained),
    (a, b) => a.length === b.length && a.every((s, i) => s.id === b[i].id),
  )
  const spellsStore = useSpellsStore()

  if (sustainedSpells.length === 0) return null

  const handleUnsustain = (spell: SpellData) => {
    spellsStore.update(produce(spell, (draft) => {
      draft.sustained = false
    }))
  }

  return (
    <Stack sx={{ gap: 0.5 }}>
      <Label label="Sustained" />
      {sustainedSpells.map((spell) => (
        <Stack
          key={spell.id}
          direction="row"
          sx={{ alignItems: "center", gap: 1, px: 0.5 }}
        >
          <Typography sx={{ flexGrow: 1 }}>{spell.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDrainFormula(spell.drainValueMod)}
          </Typography>
          <Chip
            label="Sustained"
            size="small"
            variant="filled"
            color="secondary"
            onDelete={() => handleUnsustain(spell)}
          />
        </Stack>
      ))}
    </Stack>
  )
}
