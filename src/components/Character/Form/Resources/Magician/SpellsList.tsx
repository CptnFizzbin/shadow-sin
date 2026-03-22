import { Button } from "@mui/material"
import Alert from "@mui/material/Alert"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { useCharacterBuilderStoreSlice } from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import { SpellListItem } from "#/components/Character/Form/Resources/Magician/SpellListItem.tsx"
import {
  useSpellsBuildPoints,
  useSpellsWarnings,
} from "#/components/Character/Form/Resources/Magician/SpellsHooks.ts"
import { SpellFormDialog } from "#/components/Spells/Dialogs/SpellFormDialog.tsx"
import { BuildPoints } from "#/components/UI/BuildPoints.tsx"
import type { SpellData } from "#/lib/system/types/magic/spellData.ts"

type DialogState =
  | null
  | { open: boolean; type: "add" }
  | { open: boolean; type: "edit"; spell: SpellData }

export const SpellsList: FC = () => {
  const spellsSlice = useCharacterBuilderStoreSlice(
    (state) => state.awakened.spells ?? [],
    (state, spells) => {
      state.awakened.spells = spells
      return state
    },
  )

  const buildPoints = useSpellsBuildPoints()
  const warnings = useSpellsWarnings()

  const [dialogState, setDialogState] = useState<DialogState>(null)

  const onSpellAdd = (spell: SpellData) => {
    spellsSlice.update((draft) => {
      draft.push(spell)
    })
  }

  const onSpellUpdate = (spell: SpellData) => {
    spellsSlice.update((draft) => {
      return draft.map((s) => (s.id === spell.id ? spell : s))
    })
  }

  const onSpellRemove = (spell: SpellData) => {
    spellsSlice.update((draft) => {
      return draft.filter((s) => s.id !== spell.id)
    })
  }

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

        {warnings.map((warning) => (
          <Alert key={warning} severity="warning">
            {warning}
          </Alert>
        ))}

        {spellsSlice.state.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No spells added yet.
          </Typography>
        )}

        {spellsSlice.state.map((spell) => (
          <SpellListItem
            key={spell.id}
            spell={spell}
            onEdit={() => setDialogState({ type: "edit", open: true, spell })}
          />
        ))}

        <Button
          startIcon={<RiAddLine />}
          color={"secondary"}
          variant={"outlined"}
          onClick={() => setDialogState({ type: "add", open: true })}
        >
          Add Spell
        </Button>
      </Stack>

      {dialogState?.type === "add" && (
        <SpellFormDialog
          open={dialogState.open}
          onSave={onSpellAdd}
          onClose={() => setDialogState({ ...dialogState, open: false })}
        />
      )}

      {dialogState?.type === "edit" && (
        <SpellFormDialog
          open={dialogState.open}
          spell={dialogState.spell}
          onSave={onSpellUpdate}
          onDelete={() => onSpellRemove(dialogState.spell)}
          onClose={() => setDialogState({ ...dialogState, open: false })}
        />
      )}
    </Paper>
  )
}
