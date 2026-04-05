import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { useEdgeStore } from "#/components/character/quickPanel/useEdgeStore.ts"
import { Counter } from "#/components/ui/counter/counter.tsx"
import { Label } from "#/components/ui/text/label.tsx"

export const QuickEdgeSection: FC = () => {
  const edgeStore = useEdgeStore()

  return (
    <Stack gap={0.5}>
      <Label label="Edge" variant="text" textAlign="left" />
      <Stack direction="row" alignItems="center" gap={1}>
        <Counter
          value={edgeStore.current}
          min={0}
          max={edgeStore.max}
          onChange={edgeStore.setCurrent}
        />
        <Button
          variant="outlined"
          size="small"
          color="error"
          disabled={edgeStore.max <= 1}
          onClick={edgeStore.burn}
        >
          Burn
        </Button>
      </Stack>
    </Stack>
  )
}
