import Stack from "@mui/material/Stack"
import type { FC, PropsWithChildren } from "react"

import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { AlertsList } from "#/components/ui/alerts/alertsList.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"

import type { BuilderSectionId } from "./builderSectionId.ts"
import { builderSections } from "./builderSectionId.ts"

interface BuilderSectionProps extends PropsWithChildren {
  id: BuilderSectionId
  alerts?: AlertInfo[]
}

export const BuilderSection: FC<BuilderSectionProps> = ({
  id,
  children,
  alerts = [],
}) => {
  const title = builderSections[id].label

  return (
    <Stack>
      <SectionHeader>{title}</SectionHeader>
      <AlertsList alerts={alerts} />

      {children}
    </Stack>
  )
}
