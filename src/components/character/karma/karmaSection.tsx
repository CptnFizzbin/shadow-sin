import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"

import { AddKarmaDialog } from "#/components/character/karma/addKarmaDialog.tsx"
import { selectCurrentKarma, selectTotalKarma } from "#/components/character/karma/karmaSelectors.ts"
import { useKarmaStore } from "#/components/character/karma/useKarmaStore.ts"
import type { DialogApiDialogProps } from "#/components/ui/dialogs/dialogApi.ts"
import { dialogApi } from "#/components/ui/dialogs/dialogApi.ts"
import { Label } from "#/components/ui/text/label.tsx"

export const KarmaSection: FC = () => {
  const karmaStore = useKarmaStore()
  const currentKarma = useStore(karmaStore, selectCurrentKarma)
  const totalKarma = useStore(karmaStore, selectTotalKarma)

  const handleOpenAddKarma = () => {
    dialogApi.open<void>((props: DialogApiDialogProps<void>) => (
      <AddKarmaDialog {...props} onSubmit={(amount) => karmaStore.addKarma(amount)} />
    ))
  }

  return (
    <Stack>
      <Label label="Karma" />

      <Stack direction="row" sx={{ alignItems: "center", gap: 2 }}>
        <Stack sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Current
          </Typography>
          <Typography sx={{ fontWeight: "bold" }}>{currentKarma}</Typography>
        </Stack>

        <Stack sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Total Earned
          </Typography>
          <Typography sx={{ fontWeight: "bold" }}>{totalKarma}</Typography>
        </Stack>

        <Button size="small" variant="outlined" onClick={handleOpenAddKarma}>
          Add Karma
        </Button>
      </Stack>
    </Stack>
  )
}
