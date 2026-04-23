import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"

import { TraditionFormDialog } from "#/components/character/spells/dialogs/traditionFormDialog.tsx"
import { selectTradition } from "#/components/builder/sections/resources/magician/traditionSelectors.ts"
import { useTraditionStore } from "#/components/builder/sections/resources/magician/useTraditionStore.ts"
import { AttributeLabels } from "#/system/attributeKey.ts"
import type { TraditionData } from "#/system/magic/traditionData.ts"

export const TraditionCard: FC = () => {
  const traditionStore = useTraditionStore()
  const tradition = useStore(traditionStore, selectTradition)
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

      <TraditionFormDialog
        open={dialogOpen}
        tradition={tradition}
        onSave={handleSave}
        onClose={() => setDialogOpen(false)}
      />
    </>
  )
}
