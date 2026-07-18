import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { CombatActionCategory } from "./combatActionData.ts"
import { combatActionCategories, combatActions } from "./combatActionData.ts"

interface CombatActionsCategoryListProps {
  category: CombatActionCategory
}

/** Drilled-down view of the Combat Actions Cheat Sheet: every action in one category. */
export const CombatActionsCategoryList: FC<CombatActionsCategoryListProps> = ({ category }) => {
  const categoryInfo = combatActionCategories.find((info) => info.category === category)
  const actions = combatActions.filter((action) => action.category === category)

  if (!categoryInfo) return null

  return (
    <Stack sx={{ gap: 1.5 }}>
      <Typography variant="body2" color={`${categoryInfo.color}.main`}>{categoryInfo.costHint}</Typography>
      <Stack sx={{ gap: 1.5 }} divider={<Divider />}>
        {actions.map((action) => (
          <Stack key={action.name} sx={{ gap: 0.25 }}>
            <Typography variant="subtitle2">{action.name}</Typography>
            <Typography variant="body2" color="text.secondary">{action.description}</Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}
