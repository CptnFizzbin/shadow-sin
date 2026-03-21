import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { ActiveSkillsFormGroup } from "#/components/Character/Form/Skills/ActiveSkillsFormGroup.tsx"
import { KnowledgeSkillsFormGroup } from "#/components/Character/Form/Skills/KnowledgeSkillsFormGroup.tsx"

export const SkillsFormGroup: FC = () => {
  return (
    <Stack gap={2}>
      <ActiveSkillsFormGroup />
      <Divider />
      <KnowledgeSkillsFormGroup />
    </Stack>
  )
}
