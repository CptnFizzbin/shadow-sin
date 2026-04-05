import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"

import { characterSections } from "#/components/character/characterSections.ts"
import { useCurrentCharacterSection } from "#/components/character/nav/useCharacterNav.ts"

export const CharacterSheetNav: FC = () => {
  const navigate = useNavigate({ from: "/$characterId" })
  const currentSection = useCurrentCharacterSection()

  return (
    <Tabs
      value={currentSection}
      onChange={(_, section) => navigate({ to: section.route.path })}
      variant="scrollable"
      allowScrollButtonsMobile
      scrollButtons="auto"
    >
      {Object.values(characterSections).map((section) => (
        <Tab key={section.id} label={section.label} value={section} />
      ))}
    </Tabs>
  )
}
