import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { AddKarmaDialog } from "#/components/character/karma/addKarmaDialog.tsx"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { Label } from "#/components/ui/text/label.tsx"

type AddKarmaDialogState = null | { open: boolean }

export const KarmaSection: FC = () => {
  const karma = useCharacterSheet((s) => s.karma)
  const [addKarmaDialog, setAddKarmaDialog] = useState<AddKarmaDialogState>(null)

  return (
    <Stack>
      <Label label="Karma" />

      <Stack direction="row" sx={{ alignItems: "center", gap: 2 }}>
        <Stack sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Current
          </Typography>
          <Typography sx={{ fontWeight: "bold" }}>{karma.current}</Typography>
        </Stack>

        <Stack sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Total Earned
          </Typography>
          <Typography sx={{ fontWeight: "bold" }}>{karma.total}</Typography>
        </Stack>

        <Button
          size="small"
          variant="outlined"
          onClick={() => setAddKarmaDialog({ open: true })}
        >
          Add Karma
        </Button>
      </Stack>

      {addKarmaDialog !== null && (
        <AddKarmaDialog
          open={addKarmaDialog.open}
          onClose={() => setAddKarmaDialog((prev) => prev && { ...prev, open: false })}
          onClosed={() => setAddKarmaDialog(null)}
        />
      )}
    </Stack>
  )
}
