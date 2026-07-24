import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import type { FC } from "react"

import type { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { builderSectionOrder, builderSections } from "#/components/builder/sections/builderSectionId.ts"

interface BuilderTabsProps {
  value: BuilderSectionId
  onChange: (value: BuilderSectionId) => void
}

export const BuilderTabs: FC<BuilderTabsProps> = ({ value, onChange }) => {
  return (
    <Tabs
      value={value}
      onChange={(_, next: BuilderSectionId) => onChange(next)}
      variant="scrollable"
      allowScrollButtonsMobile
      scrollButtons="auto"
    >
      {builderSectionOrder.map((id) => (
        <Tab key={id} label={builderSections[id].label} value={id} />
      ))}
    </Tabs>
  )
}
