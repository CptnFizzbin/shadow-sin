import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { useSpellsBuildPoints } from "#/components/builder/buildPoints/hooks/useSpellsBuildPoints.ts"
import { useSpellFormDialog } from "#/components/character/spells/dialogs/spellFormDialog.tsx"
import { selectAllSpells } from "#/components/character/spells/spellsSelectors.ts"
import { useSpellsStore } from "#/components/character/spells/useSpellsStore.ts"
import { BuildPoints } from "#/components/ui/buildPoints.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import type { SpellData } from "#/system/magic/spellData.ts"

import { SpellListItem } from "./spellListItem.tsx"
import { TraditionCard } from "./traditionCard.tsx"

export const SpellsList: FC = () => {
  const spellsStore = useSpellsStore()
  const spells = useSelector(spellsStore, selectAllSpells)
  const buildPoints = useSpellsBuildPoints()
  const spellFormDialog = useSpellFormDialog()

  const handleAddSpell = async () => {
    const saved = await spellFormDialog.open()
    if (saved) spellsStore.save(saved)
  }

  const handleEditSpell = async (spell: SpellData) => {
    const saved = await spellFormDialog
      .open({ spell, onDelete: () => spellsStore.remove(spell.id) })
    if (saved) spellsStore.save(saved)
  }

  return (
    <Stack sx={{ gap: 1 }}>
      <Stack>
        <BuildPoints
          value={buildPoints.spent}
          total={buildPoints.allowance}
        />
      </Stack>

      <Label label="Tradition" variant="outlined" />
      <TraditionCard />

      <Label label="Spells" variant="outlined" />
      {spells.length === 0 && (
        <Typography color="text.secondary">
          No spells added yet.
        </Typography>
      )}

      {spells.map((spell) => (
        <SpellListItem
          key={spell.id}
          spell={spell}
          onEdit={() => handleEditSpell(spell)}
        />
      ))}

      <Button
        startIcon={<RiAddLine />}
        color="secondary"
        variant="outlined"
        onClick={handleAddSpell}
      >
        Add Spell
      </Button>

      {spellFormDialog.dialog}
    </Stack>
  )
}
