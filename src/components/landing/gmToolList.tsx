import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { RiBarricadeFill } from "@remixicon/react"
import { Link } from "@tanstack/react-router"
import type { FC } from "react"

import { gmToolOrder } from "./gmTools.ts"

export const GmToolList: FC = () => (
  <Paper>
    <List disablePadding>
      {gmToolOrder.map((tool, index) => (
        <ListItem key={tool.id} divider={index < gmToolOrder.length - 1} disablePadding>
          <ListItemButton component={Link} to={tool.route.path}>
            <ListItemText
              primary={<Typography variant="h2">{tool.label}</Typography>}
              secondary={<Typography color="text.secondary">{tool.description}</Typography>}
            />
            <Tooltip title="Under construction">
              <ListItemIcon sx={{ minWidth: "auto", color: "warning.main" }}>
                <RiBarricadeFill />
              </ListItemIcon>
            </Tooltip>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Paper>
)
