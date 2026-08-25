import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useSpellFormDialog } from "#/components/runner/magician/spells/dialogs/spellFormDialog.tsx"
import { BuildPoints } from "#/components/ui/buildPoints.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { useSpellsBuildPoints } from "#/hooks/builder/buildPoints/useSpellsBuildPoints.ts"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import type { SpellData } from "#/system/magic/spellData.ts"

import { SpellListItem } from "./spellListItem.tsx"
import { TraditionCard } from "./traditionCard.tsx"

export const SpellsList: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const spells = useRunnerStoreSelector(Selectors.spells.selectSpells)
  const buildPoints = useSpellsBuildPoints()
  const spellFormDialog = useSpellFormDialog()

  const handleAddSpell = async () => {
    const saved = await spellFormDialog.open()
    if (saved) dispatch(Actions.spells.saveSpell(saved))
  }

  const handleEditSpell = async (spell: SpellData) => {
    const saved = await spellFormDialog
      .open({ spell, onDelete: () => dispatch(Actions.spells.removeSpell(spell.id)) })
    if (saved) dispatch(Actions.spells.saveSpell(saved))
  }

  return (
    <Stack>
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

      {spellFormDialog.outlet}
    </Stack>
  )
}
