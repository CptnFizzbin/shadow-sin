import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useSelector } from "@tanstack/react-store"
import pluralize from "pluralize"
import type { FC } from "react"

import type { DiceTrayApi } from "#/components/dice/diceTrayApi.ts"
import { Label } from "#/components/ui/text/label.tsx"

interface DiceTrayExtendedHistoryProps {
  diceTrayApi: DiceTrayApi
}

export const DiceTrayExtendedHistory: FC<DiceTrayExtendedHistoryProps> = ({ diceTrayApi }) => {
  const extendedHistory = useSelector(diceTrayApi.store, (state) => state.extendedHistory)

  if (extendedHistory.length === 0) return null

  return (
    <Stack sx={{ gap: 0.5 }}>
      <Label label="Roll History" variant="text" />
      {extendedHistory.map((entry, index) => (
        <Typography key={index} variant="caption" sx={{ textAlign: "center" }}>
          Roll {index + 1}: {entry.hits} {pluralize("hit", entry.hits)}
          {entry.edgeUsed ? " (edge)" : ""}
        </Typography>
      ))}
    </Stack>
  )
}
