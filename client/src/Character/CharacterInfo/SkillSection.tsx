import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { FC } from 'react'

import {
  ActiveSkillList,
  ActiveSkillIds,
  isKnowledgeSkill,
  isLanguageSkill,
  KnowledgeSkillList,
  LanguageSkillList,
} from '../../Skills'
import { useActiveSkills, useCharacterData } from '../CharacterProvider'

export const SkillSection: FC = () => {
  const character = useCharacterData()
  const charActiveSkills = useActiveSkills(Object.values(ActiveSkillIds))

  if (!character) return null
  const languageSkills = character.skills.filter(isLanguageSkill)
  const knowledgeSkills = character.skills.filter(isKnowledgeSkill)

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <Typography variant={'h6'}>Skills</Typography>
        <ActiveSkillList charSkills={Object.values(charActiveSkills)} />
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant={'h6'}>Languages</Typography>
          <LanguageSkillList skills={languageSkills} />
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant={'h6'}>Knowledge</Typography>
          <KnowledgeSkillList skills={knowledgeSkills} />
        </Box>
      </Box>
    </>
  )
}
