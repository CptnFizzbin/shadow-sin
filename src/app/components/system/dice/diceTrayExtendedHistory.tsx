import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import pluralize from "pluralize"
import type { FC } from "react"

import { useSelector } from "#state/reduxToolkit/useSelector.ts"
import { Label } from "#ui/text/label.tsx"

import { useDiceTray } from "./diceTrayContext.ts"

export const DiceTrayExtendedHistory: FC = () => {
  const diceTrayApi = useDiceTray()
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
