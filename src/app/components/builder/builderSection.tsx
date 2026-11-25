import Stack from "@mui/material/Stack"
import type { FC, PropsWithChildren } from "react"

import type { AlertInfo } from "#/common/alerts/alertInfo.ts"
import type { BuilderSectionId } from "#/state/builder/builderSectionId.ts"
import { builderSections } from "#/state/builder/builderSectionId.ts"
import { AlertsList } from "#/ui/alerts/alertsList.tsx"
import { SectionHeader } from "#/ui/text/sectionHeader.tsx"

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
