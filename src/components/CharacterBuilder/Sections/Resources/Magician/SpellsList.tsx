import { Button } from "@mui/material"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"

import { SpellListItem } from "#/components/CharacterBuilder/Sections/Resources/Magician/SpellListItem.tsx"
import { useSpellsBuildPoints } from "#/components/CharacterBuilder/Sections/Resources/Magician/SpellsHooks.ts"
import { useSpellsStore } from "#/components/CharacterBuilder/Sections/Resources/Magician/UseSpellsStore.ts"
import { SpellFormDialog } from "#/components/Spells/Dialogs/SpellFormDialog.tsx"
import { BuildPoints } from "#/components/UI/BuildPoints.tsx"
import type { SpellData } from "#/lib/system/magic/spellData.ts"

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
    <Paper sx={{ padding: 1 }}>
      <Stack gap={1}>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Spells
        </Typography>

        <Stack>
          <BuildPoints
            value={buildPoints.spent}
            total={buildPoints.allowance}
          />
        </Stack>

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
      </Stack>

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
    </Paper>
  )
}
