import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { FC } from 'react'

import {
  ActiveSkillList,
  ActiveSkillName,
  isKnowledgeSkill,
  isLanguageSkill,
  KnowledgeSkillList,
  LanguageSkillList,
} from '../../Skills'
import { InfoSection } from '../../UI/InfoBlock/InfoSection'
import { useActiveSkills, useCharacterData } from '../CharacterProvider'

export const SkillSection: FC = () => {
  const character = useCharacterData()
  const charActiveSkills = useActiveSkills(Object.values(ActiveSkillName))

  if (!character) return null
  const languageSkills = character.skills.filter(isLanguageSkill)
  const knowledgeSkills = character.skills.filter(isKnowledgeSkill)

  return <InfoSection>
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      <Box sx={{ padding: 1, flexGrow: 1 }}>
        <Typography variant={'h6'}>Trained Skills</Typography>
        <ActiveSkillList charSkills={Object.values(charActiveSkills)} />
      </Box>
    </Box>

    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      <Box sx={{ padding: 1, flexGrow: 1 }}>
        <Typography variant={'h6'}>Languages</Typography>
        <LanguageSkillList skills={languageSkills} />
      </Box>

      <Box sx={{ padding: 1, flexGrow: 1 }}>
        <Typography variant={'h6'}>Knowledge</Typography>
        <KnowledgeSkillList skills={knowledgeSkills} />
      </Box>
    </Box>
  </InfoSection>
}
