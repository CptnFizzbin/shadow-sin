import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { ActiveSkillsFormGroup } from "#/components/Character/Form/Skills/ActiveSkillsFormGroup.tsx"
import { KnowledgeSkillsFormGroup } from "#/components/Character/Form/Skills/KnowledgeSkillsFormGroup.tsx"
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts"

export interface SkillsFormGroupProps {
  form: PlayerCharacterForm
}

export const SkillsFormGroup: FC<SkillsFormGroupProps> = ({ form }) => {
  return (
    <Stack gap={2}>
      <ActiveSkillsFormGroup form={form} />
      <Divider />
      <KnowledgeSkillsFormGroup form={form} />
    </Stack>
  )
}
