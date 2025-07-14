import { Box, Paper } from "@mui/material"
import { FC, useState } from "react"

import { AppBar } from "../UI/AppBar"
import { NavDrawerProps } from "../UI/NavDrawer"

interface RootLayoutProps {
  NavDrawer?: FC<NavDrawerProps>
}

export const RootLayout: FC<RootLayoutProps> = ({ NavDrawer, children }) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  return (
    <Paper
      sx={{
        display: "grid",
        gridTemplateRows: "auto 1fr",
        bgcolor: "background.default",
        height: "100vh",
        width: "100vw",
        overflow: "auto",
      }}
      square
    >
      <AppBar withMenu={!!NavDrawer} openMenu={() => setDrawerOpen(true)} />
      {NavDrawer && (
        <NavDrawer open={drawerOpen} closeDrawer={() => setDrawerOpen(false)} />
      )}

      <Box sx={{ width: "100%", maxWidth: 1200, margin: "0 auto", padding: 1 }}>
        {children}
      </Box>
    </Paper>
  )
}
