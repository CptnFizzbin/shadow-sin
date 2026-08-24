import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useTraditionFormDialog } from "#/components/runner/magician/spells/dialogs/traditionFormDialog.tsx"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { TraditionSelectors } from "#/stores/runner/tradition/traditionSlice.selectors.ts"
import { AttributeLabels } from "#/system/attributeKey.ts"

export const TraditionCard: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const tradition = useRunnerSelector(TraditionSelectors.select)
  const traditionFormDialog = useTraditionFormDialog()

  const handleOpen = async () => {
    const saved = await traditionFormDialog.open({ tradition })
    if (saved) dispatch(Actions.tradition.saveTradition(saved))
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
        onClick={handleOpen}
      >
        {tradition
          ? (
              <Stack direction="row" sx={{ alignItems: "center" }}>
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
      {traditionFormDialog.dialog}
    </>
  )
}
