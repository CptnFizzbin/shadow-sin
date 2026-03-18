import MenuIcon from "@mui/icons-material/Menu"
import Dialog from "@mui/material/Dialog"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import { Link, linkOptions } from "@tanstack/react-router"
import { type FC, useState } from "react"
import { Route as CharacterRoute } from "#/routes/$characterId/index.tsx"

const pages = linkOptions([
  { label: "About", from: CharacterRoute.fullPath, to: "about" },
  { label: "Defense", from: CharacterRoute.fullPath, to: "defense" },
  { label: "Offense", from: CharacterRoute.fullPath, to: "offense" },
  { label: "Gear", from: CharacterRoute.fullPath, to: "gear" },
  { label: "Skills", from: CharacterRoute.fullPath, to: "skills" },
  { label: "Spells", from: CharacterRoute.fullPath, to: "spells" },
  { label: "Drones", from: CharacterRoute.fullPath, to: "drones" },
  { label: "Vehicles", from: CharacterRoute.fullPath, to: "vehicles" },
  { label: "Contacts", from: CharacterRoute.fullPath, to: "contacts" },
  { label: "Qualities", from: CharacterRoute.fullPath, to: "qualities" },
  { label: "Notes", from: CharacterRoute.fullPath, to: "notes" },
])

export const CharacterNavMenu: FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <IconButton
        color="inherit"
        size="small"
        onClick={() => setMenuOpen(true)}
        aria-label="Open pages"
      >
        <MenuIcon />
      </IconButton>

      <Dialog onClose={() => setMenuOpen(false)} open={menuOpen} fullWidth>
        <List>
          {pages.map((option) => (
            <Link
              {...option}
              key={option.to}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton onClick={() => setMenuOpen(false)}>
                <ListItemText primary={option.label} />
              </ListItemButton>
            </Link>
          ))}
        </List>
      </Dialog>
    </>
  )
}
