import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"

import { useCurrentCharacterSection } from "#/components/Character/Nav/use-character-nav.ts"
import { characterSections } from "#/components/Character/character-sections.ts"

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
