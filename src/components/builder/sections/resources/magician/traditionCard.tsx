import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { useTraditionFormDialog } from "#/components/character/spells/dialogs/traditionFormDialog.tsx"
import { AttributeLabels } from "#/system/attributeKey.ts"

import { selectTradition } from "./traditionSelectors.ts"
import { useTraditionStore } from "./useTraditionStore.ts"

export const TraditionCard: FC = () => {
  const traditionStore = useTraditionStore()
  const tradition = useSelector(traditionStore, selectTradition)
  const traditionFormDialog = useTraditionFormDialog()

  const handleOpen = async () => {
    const saved = await traditionFormDialog.open({ tradition }).result
    if (saved) traditionStore.save(saved)
  }

  return (
    <Paper
      sx={{
        "padding": 1,
        "border": "1px solid",
        "borderColor": "divider",
        "cursor": "pointer",
        "&:hover": { bgcolor: "action.hover" },
      }}
      onClick={handleOpen}
    >
      {tradition
        ? (
            <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
              <Typography sx={{ flexGrow: 1 }}>{tradition.name}</Typography>
              <Typography color="text.secondary">
                WIL + {AttributeLabels[tradition.drainAttribute]}
              </Typography>
            </Stack>
          )
        : (
            <Typography color="text.secondary" sx={{ textAlign: "center" }}>
              Set Tradition
            </Typography>
          )}
    </Paper>
  )
}
