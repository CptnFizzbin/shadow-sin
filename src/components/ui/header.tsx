import DarkModeIcon from "@mui/icons-material/DarkMode"
import LightModeIcon from "@mui/icons-material/LightMode"
import AppBar from "@mui/material/AppBar"
import IconButton from "@mui/material/IconButton"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { useColorScheme } from "@mui/material/styles"
import { Link } from "@tanstack/react-router"
import type { FC } from "react"

export const Header: FC = () => {
  const { mode, setMode } = useColorScheme()

  const handleToggleColorMode = () => {
    setMode(mode === "light" ? "dark" : "light")
  }

  return (
    <AppBar role="banner" position="sticky" color="default" elevation={0}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h5" component={Link} to="/" sx={{ textDecoration: "none", color: "inherit", flexGrow: 1 }}>
          ShadowSIN
        </Typography>
        <IconButton onClick={handleToggleColorMode} color="inherit" aria-label="toggle color mode">
          {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
