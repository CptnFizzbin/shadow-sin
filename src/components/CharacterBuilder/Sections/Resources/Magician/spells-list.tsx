import { Button } from "@mui/material"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"

import { useSpellsBuildPoints } from "#/components/CharacterBuilder/BuildPoints/Hooks/use-spells-build-points.ts"
import { SpellListItem } from "#/components/CharacterBuilder/Sections/Resources/Magician/spell-list-item.tsx"
import { TraditionCard } from "#/components/CharacterBuilder/Sections/Resources/Magician/tradition-card.tsx"
import { SpellFormDialog } from "#/components/Spells/Dialogs/spell-form-dialog.tsx"
import { useSpellsStore } from "#/components/Spells/use-spells-store.ts"
import { BuildPoints } from "#/components/UI/build-points.tsx"
import { Label } from "#/components/UI/text/label.tsx"
import type { SpellData } from "#/lib/system/magic/spell-data.ts"

type DialogState =
  | null
  | { open: boolean, type: "add" }
  | { open: boolean, type: "edit", spell: SpellData }

export const SpellsList: FC = () => {
  const spellsStore = useSpellsStore()
  const spells = useStore(spellsStore, (state) => state)
  const buildPoints = useSpellsBuildPoints()

  const [dialogState, setDialogState] = useState<DialogState>(null)

  return (
    <Stack gap={1}>
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
        <Typography variant="body2" color="text.secondary">
          No spells added yet.
        </Typography>
      )}

      {spells.map((spell) => (
        <SpellListItem
          key={spell.id}
          spell={spell}
          onEdit={() => setDialogState({ type: "edit", open: true, spell })}
        />
      ))}

      <Button
        startIcon={<RiAddLine />}
        color="secondary"
        variant="outlined"
        onClick={() => setDialogState({ type: "add", open: true })}
      >
        Add Spell
      </Button>

      {dialogState?.type === "add" && (
        <SpellFormDialog
          open={dialogState.open}
          onSave={(spell) => spellsStore.add(spell)}
          onClose={() => setDialogState({ ...dialogState, open: false })}
        />
      )}

      {dialogState?.type === "edit" && (
        <SpellFormDialog
          open={dialogState.open}
          spell={dialogState.spell}
          onSave={(spell) => spellsStore.update(spell)}
          onDelete={() => spellsStore.remove(dialogState.spell.id)}
          onClose={() => setDialogState({ ...dialogState, open: false })}
        />
      )}
    </Stack>
  )
}
