import DarkModeIcon from "@mui/icons-material/DarkMode"
import LightModeIcon from "@mui/icons-material/LightMode"
import AppBar from "@mui/material/AppBar"
import IconButton from "@mui/material/IconButton"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { useColorScheme } from "@mui/material/styles"
import { Link } from "@tanstack/react-router"
import type { FC } from "react"

import { RunnerHeaderSummary } from "#/components/runner/header/runnerHeaderSummary.tsx"
import { useActiveRunnerStoreContext } from "#/lib/contexts/runner/activeRunnerStoreContext.tsx"
import { RunnerStoreContext } from "#/lib/contexts/runner/runnerStore.context.ts"

export const Header: FC = () => {
  const { mode, setMode } = useColorScheme()
  const { activeStore } = useActiveRunnerStoreContext()

  const handleToggleColorMode = () => {
    setMode(mode === "light" ? "dark" : "light")
  }

  return (
    <AppBar role="banner" position="sticky" sx={{ backgroundColor: "background.paper" }}>
      <Toolbar>
        <Typography
          variant="h1"
          component={Link}
          to="/"
          sx={{ textDecoration: "none", color: "text.primary", flexGrow: 1, fontSize: 32 }}
        >
          ShadowSIN
        </Typography>
        <IconButton onClick={handleToggleColorMode} color="primary" aria-label="toggle color mode">
          {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Toolbar>

      {activeStore && (
        <RunnerStoreContext.Provider value={activeStore}>
          <RunnerHeaderSummary />
        </RunnerStoreContext.Provider>
      )}
    </AppBar>
  )
}
