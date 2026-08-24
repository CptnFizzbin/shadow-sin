import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import { RiMenuLine } from "@remixicon/react"
import { Navigate, useNavigate } from "@tanstack/react-router"
import type { FC } from "react"
import { useState } from "react"

import { runnerSections } from "#/components/runner/runnerSections.ts"
import { useCurrentRunnerSection } from "#/hooks/runner/nav/useRunnerNav.ts"
import { selectRunnerTabs } from "#/hooks/runner/nav/useRunnerTabs.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"

import { NavMenuDrawer } from "./navMenuDrawer.tsx"

export const RunnerNav: FC = () => {
  const navigate = useNavigate({ from: "/$runnerId" })
  const currentSection = useCurrentRunnerSection()
  const [menuOpen, setMenuOpen] = useState(false)
  const visibleSections = useRunnerSelector(selectRunnerTabs)

  const isCurrentSectionVisible = visibleSections.some((section) => section.id === currentSection.id)

  if (!isCurrentSectionVisible) {
    return <Navigate to={runnerSections.about.route.path} replace />
  }

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tabs
          value={currentSection}
          onChange={(_, section) => navigate({ to: section.route.path })}
          variant="scrollable"
          allowScrollButtonsMobile
          scrollButtons="auto"
          sx={{ flex: 1, minWidth: 0 }}
        >
          {visibleSections.map((section) => (
            <Tab key={section.id} label={section.label} value={section} />
          ))}
        </Tabs>

        <IconButton
          onClick={() => setMenuOpen(true)}
          aria-label="Open page menu"
          sx={{ flexShrink: 0 }}
        >
          <RiMenuLine />
        </IconButton>
      </Box>

      <NavMenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
