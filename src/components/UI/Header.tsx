import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { Link } from "@tanstack/react-router"
import type { FC } from "react"

export const Header: FC = () => {
  return (
    <AppBar role="banner" position="sticky" color="default" elevation={0}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h5" component={Link} to="/" sx={{ textDecoration: "none", color: "inherit" }}>
          ShadowSIN
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
