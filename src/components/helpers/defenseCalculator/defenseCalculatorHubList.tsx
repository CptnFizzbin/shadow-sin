import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import { RiArrowRightSLine } from "@remixicon/react"
import type { FC } from "react"

import type { DefenseAttackType } from "./defenseCalculatorData.ts"
import { defenseAttackTypes } from "./defenseCalculatorData.ts"

interface DefenseCalculatorHubListProps {
  onSelectAttackType: (attackType: DefenseAttackType) => void
}

/** Landing view of the Defense Calculator: one row per type of incoming attack. */
export const DefenseCalculatorHubList: FC<DefenseCalculatorHubListProps> = ({ onSelectAttackType }) => (
  <Paper>
    <List disablePadding>
      {defenseAttackTypes.map((typeInfo, index) => (
        <ListItem
          key={typeInfo.type}
          disablePadding
          divider={index < defenseAttackTypes.length - 1}
          secondaryAction={(
            <RiArrowRightSLine size={18} style={{ color: "var(--mui-palette-text-secondary)" }} />
          )}
        >
          <ListItemButton onClick={() => onSelectAttackType(typeInfo.type)} sx={{ minHeight: 56 }}>
            <ListItemIcon sx={{ minWidth: 36, color: `${typeInfo.color}.main` }}>
              <typeInfo.Icon size={20} />
            </ListItemIcon>
            <ListItemText primary={typeInfo.label} secondary={typeInfo.description} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Paper>
)
