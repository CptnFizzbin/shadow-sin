import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"

import { useEdgeStore } from "#/components/character/quickPanel/useEdgeStore.ts"
import { Counter } from "#/components/ui/counter/counter.tsx"
import { useConfirmDialog } from "#/components/ui/dialogs/useConfirmDialog.tsx"
import { Label } from "#/components/ui/text/label.tsx"

export const QuickEdgeSection: FC = () => {
  const confirmDialog = useConfirmDialog({ id: "edge-confirm-burn" })
  const edgeStore = useEdgeStore()

  const max = useStore(edgeStore, (state) => state.max)
  const current = useStore(edgeStore, (state) => state.current)

  const onBurnClick = async () => {
    if (await confirmDialog.confirm({
      title: "Burn a point of Edge?",
      body: (
        <Typography>
          This will <Typography component="span" color="error">permanently</Typography> reduce your edge by 1.
          You'll need to spend karma to restore it.
        </Typography>
      ),
      slotProps: {
        confirmButton: { label: "BURN IT" },
      },
    })) {
      edgeStore.burn()
    }
  }

  return (
    <Stack sx={{ gap: 0.5 }}>
      <Label label="Edge" />

      <Counter
        value={current}
        min={0}
        max={max}
        onChange={(value) => edgeStore.setCurrent(value)}
      />

      <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
        <Button
          variant="outlined"
          color="error"
          disabled={max <= 1}
          onClick={onBurnClick}
          fullWidth
        >
          Burn
        </Button>
        <Button
          variant="outlined"
          disabled={max <= 1}
          onClick={() => edgeStore.restore()}
          fullWidth
        >
          Restore
        </Button>
      </Stack>
    </Stack>
  )
}
