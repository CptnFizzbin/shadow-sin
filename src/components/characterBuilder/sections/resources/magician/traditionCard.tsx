import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"

import { TraditionFormDialog } from "#/components/characterBuilder/sections/resources/magician/traditionFormDialog.tsx"
import { useTraditionStore } from "#/components/characterBuilder/sections/resources/magician/useTraditionStore.ts"
import { AttributeLabels } from "#/lib/system/attributeKey.ts"
import type { TraditionData } from "#/lib/system/magic/traditionData.ts"

export const TraditionCard: FC = () => {
  const traditionStore = useTraditionStore()
  const tradition = useStore(traditionStore, (state) => state)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleSave = (updatedTradition: TraditionData) => {
    traditionStore.save(updatedTradition)
  }

  return (
    <>
      <Paper
        sx={{
          "padding": 1,
          "border": "1px solid",
          "borderColor": "divider",
          "cursor": "pointer",
          "&:hover": { bgcolor: "action.hover" },
        }}
        onClick={() => setDialogOpen(true)}
      >
        {tradition
          ? (
              <Stack direction="row" gap={1} alignItems="center">
                <Typography flexGrow={1}>{tradition.name}</Typography>
                <Typography variant="body2" color="text.secondary">
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

      <TraditionFormDialog
        open={dialogOpen}
        tradition={tradition}
        onSave={handleSave}
        onClose={() => setDialogOpen(false)}
      />
    </>
  )
}
