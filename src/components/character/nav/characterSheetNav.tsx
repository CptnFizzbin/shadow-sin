import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import { RiMenuLine } from "@remixicon/react"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"
import { useState } from "react"

import { characterSections } from "#/components/character/characterSections.ts"
import { NavMenuDrawer } from "#/components/character/nav/navMenuDrawer.tsx"
import { useCurrentCharacterSection } from "#/components/character/nav/useCharacterNav.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"

export const CharacterSheetNav: FC = () => {
  const navigate = useNavigate({ from: "/$characterId" })
  const currentSection = useCurrentCharacterSection()
  const [menuOpen, setMenuOpen] = useState(false)
  const awakening = useCharacterSheet((sheet) => sheet.biology.awakening)

  const visibleSections = Object.values(characterSections).filter(
    (section) => !section.visibleFor || section.visibleFor.includes(awakening),
  )

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
