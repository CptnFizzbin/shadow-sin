import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useTraditionFormDialog } from "#/components/runner/awakenings/magician/viewer/spells/dialogs/traditionFormDialog.tsx"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { TraditionSelectors } from "#/state/runner/tradition/tradition.selector.ts"
import { AttributeLabels } from "#/system/model/attributes/attributeKey.ts"

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
      {traditionFormDialog.outlet}
    </>
  )
}
