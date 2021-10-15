import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { FC } from 'react'

import { ActiveSkillData } from '../../../System/Skill/ActiveSkill/ActiveSkillData'
import { ActiveSkillList } from '../../../System/Skill/ActiveSkill/ActiveSkillList'
import { KnowledgeSkillData } from '../../../System/Skill/KnowledgeSkill/KnowledgeSkillData'
import { KnowledgeSkillList } from '../../../System/Skill/KnowledgeSkill/KnowledgeSkillList'
import { LanguageSkillData } from '../../../System/Skill/LanguageSkill/LanguageSkillData'
import { LanguageSkillList } from '../../../System/Skill/LanguageSkill/LanguageSkillList'
import { SkillType } from '../../../System/Skill/SkillData'
import { InfoSection } from '../../../UI/InfoBlock/InfoSection'
import { useCharacterData } from '../../CharacterProvider'

export const SkillSection: FC = () => {
  const character = useCharacterData()
  if (!character) return null

  const activeSkills = character.skills
    .filter(skill => skill.type === SkillType.active)
    .map(skill => skill as ActiveSkillData)

  const languageSkills = character.skills
    .filter(skill => skill.type === SkillType.language)
    .map(skill => skill as LanguageSkillData)

  const knowledgeSkills = character.skills
    .filter(skill => skill.type === SkillType.knowledge)
    .map(skill => skill as KnowledgeSkillData)

  return <InfoSection>
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      <Box sx={{ padding: 1, flexGrow: 1 }}>
        <Typography variant={'h6'}>Skills</Typography>
        <ActiveSkillList skills={activeSkills} />
      </Box>

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
