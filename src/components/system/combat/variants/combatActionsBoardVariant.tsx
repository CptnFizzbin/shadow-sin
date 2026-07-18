import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { combatActionCategories, combatActions } from "#/components/system/combat/combatActionData.ts"

export const CombatActionsBoardVariant: FC = () => {
  return (
    <Stack direction="row" sx={{ gap: 1, overflowX: "auto", pb: 1 }}>
      {combatActionCategories.map((categoryInfo) => {
        const actions = combatActions.filter((action) => action.category === categoryInfo.category)

        return (
          <Card key={categoryInfo.category} variant="outlined" sx={{ minWidth: 220, flex: "1 0 220px" }}>
            <CardHeader
              title={categoryInfo.label}
              subheader={categoryInfo.costHint}
              slotProps={{ subheader: { variant: "caption" } }}
              sx={{ pb: 0 }}
            />
            <CardContent>
              <Stack sx={{ gap: 1.5 }}>
                {actions.map((action) => (
                  <Stack
                    key={action.name}
                    sx={{ gap: 0.25, borderLeft: "3px solid", borderColor: `${categoryInfo.color}.main`, pl: 1 }}
                  >
                    <Typography variant="subtitle2">{action.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{action.description}</Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        )
      })}
    </Stack>
  )
}
