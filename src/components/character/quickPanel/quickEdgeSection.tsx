import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useEdgeStore } from "#/components/character/quickPanel/useEdgeStore.ts"
import { Label } from "#/components/ui/text/label.tsx"

export const QuickEdgeSection: FC = () => {
  const edgeStore = useEdgeStore()

  return (
    <Stack gap={0.5}>
      <Label label="Edge" variant="text" textAlign="left" />
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography variant="h6" sx={{ minWidth: 48, textAlign: "center" }}>
          {edgeStore.current} / {edgeStore.max}
        </Typography>
        <Stack direction="row" gap={0.5} flexWrap="wrap">
          <Button
            variant="outlined"
            size="small"
            disabled={edgeStore.current <= 0}
            onClick={() => edgeStore.spend()}
          >
            Spend
          </Button>
          <Button
            variant="outlined"
            size="small"
            disabled={edgeStore.current >= edgeStore.max}
            onClick={() => edgeStore.recharge()}
          >
            Recharge
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            disabled={edgeStore.max <= 1}
            onClick={() => edgeStore.burn()}
          >
            Burn
          </Button>
        </Stack>
      </Stack>
    </Stack>
  )
}
