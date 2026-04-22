import { Button } from "@mui/material"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"

import { useSpellsBuildPoints } from "#/components/characterBuilder/buildPoints/hooks/useSpellsBuildPoints.ts"
import { SpellListItem } from "#/components/characterBuilder/sections/resources/magician/spellListItem.tsx"
import { TraditionCard } from "#/components/characterBuilder/sections/resources/magician/traditionCard.tsx"
import { SpellFormDialog } from "#/components/spells/dialogs/spellFormDialog.tsx"
import { selectAllSpells } from "#/components/spells/spellsSelectors.ts"
import { useSpellsStore } from "#/components/spells/useSpellsStore.ts"
import { BuildPoints } from "#/components/ui/buildPoints.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import type { SpellData } from "#/system/magic/spellData.ts"

type DialogState =
  | null
  | { open: boolean, type: "add" }
  | { open: boolean, type: "edit", spell: SpellData }

export const SpellsList: FC = () => {
  const spellsStore = useSpellsStore()
  const spells = useStore(spellsStore, selectAllSpells)
  const buildPoints = useSpellsBuildPoints()

  const [dialogState, setDialogState] = useState<DialogState>(null)

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
          onSave={(spell) => spellsStore.save(spell)}
          onClose={() => setDialogState({ ...dialogState, open: false })}
        />
      )}

      {dialogState?.type === "edit" && (
        <SpellFormDialog
          open={dialogState.open}
          spell={dialogState.spell}
          onSave={(spell) => spellsStore.save(spell)}
          onDelete={() => spellsStore.remove(dialogState.spell.id)}
          onClose={() => setDialogState({ ...dialogState, open: false })}
        />
      )}
    </Stack>
  )
}
