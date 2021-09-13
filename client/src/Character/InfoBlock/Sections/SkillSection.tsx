import { Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { ActiveSkillList } from '../../../System/Skill/ActiveSkillList'
import { KnowledgeSkillList } from '../../../System/Skill/KnowledgeSkillList'
import { LanguageSkillList } from '../../../System/Skill/LanguageSkillList'
import { ActiveSkillData, KnowledgeSkillData, LanguageSkillData, SkillType } from '../../../System/Skill/SkillData'
import { InfoSection } from '../../../UI/InfoBlock/InfoSection'
import { useCharacter } from '../../CharacterProvider'

export const SkillSection: FC = () => {
  const character = useCharacter()
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
