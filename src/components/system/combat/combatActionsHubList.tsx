import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import { RiArrowRightSLine } from "@remixicon/react"
import type { FC } from "react"

import type { CombatActionCategory } from "./combatActionData.ts"
import { combatActionCategories } from "./combatActionData.ts"

interface CombatActionsHubListProps {
  onSelectCategory: (category: CombatActionCategory) => void
}

/** Landing view of the Combat Actions Cheat Sheet: one row per action-economy category. */
export const CombatActionsHubList: FC<CombatActionsHubListProps> = ({ onSelectCategory }) => (
  <Paper>
    <List disablePadding>
      {combatActionCategories.map((categoryInfo, index) => (
        <ListItem
          key={categoryInfo.category}
          disablePadding
          divider={index < combatActionCategories.length - 1}
          secondaryAction={(
            <RiArrowRightSLine size={18} style={{ color: "var(--mui-palette-text-secondary)" }} />
          )}
        >
          <ListItemButton onClick={() => onSelectCategory(categoryInfo.category)} sx={{ minHeight: 56 }}>
            <ListItemIcon sx={{ minWidth: 36, color: `${categoryInfo.color}.main` }}>
              <categoryInfo.Icon size={20} />
            </ListItemIcon>
            <ListItemText primary={categoryInfo.label} secondary={categoryInfo.costHint} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Paper>
)
