import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Stack from "@mui/material/Stack"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { RiCloseLine } from "@remixicon/react"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"

import { characterSectionOrder } from "#/components/character/characterSections.ts"
import { useCurrentCharacterSection } from "#/components/character/nav/useCharacterNav.ts"

export interface NavMenuDrawerProps {
  open: boolean
  onClose: () => void
}

export const NavMenuDrawer: FC<NavMenuDrawerProps> = ({ open, onClose }) => {
  const navigate = useNavigate({ from: "/$characterId" })
  const currentSection = useCurrentCharacterSection()

  const handleSectionClick = (sectionRoute: string) => {
    navigate({ to: sectionRoute })
    onClose()
  }

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: "100vw" } }}
    >
      <Toolbar sx={{ justifyContent: "space-between", paddingX: 1 }}>
        <Typography variant="h6">Go to page</Typography>
        <IconButton onClick={onClose} aria-label="Close menu">
          <RiCloseLine />
        </IconButton>
      </Toolbar>

      <List disablePadding>
        {characterSectionOrder.map((section) => (
          <ListItem key={section.id} disablePadding>
            <ListItemButton
              selected={section.id === currentSection.id}
              onClick={() => handleSectionClick(section.route.path)}
            >
              <Stack direction="row" alignItems="center" gap={1} sx={{ width: "100%" }}>
                <ListItemText
                  primary={section.label}
                  slotProps={{
                    primary: {
                      variant: "body1",
                      fontWeight: section.id === currentSection.id ? "bold" : undefined,
                    },
                  }}
                />
              </Stack>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}
