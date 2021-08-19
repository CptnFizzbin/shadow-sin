import { Paper, Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { DamageTrack } from '../DamageTrack/DamageTrack'
import { useAttributeValue } from '../System/AttributeProvider'
import { ActiveSkillList } from '../System/Skill/ActiveSkillList'
import { KnowledgeSkillList } from '../System/Skill/KnowledgeSkillList'
import { LanguageSkillList } from '../System/Skill/LanguageSkillList'
import { ActiveSkillData, KnowledgeSkillData, LanguageSkillData, SkillType } from '../System/Skill/SkillData'
import { AttributeBlock } from '../UI/AttributeBlock'
import { CharacterAttr } from './CharacterData'
import { useCharacter } from './CharacterProvider'

export const CharacterInfo: FC = () => {
  const { character } = useCharacter()

  const bodyAttr = useAttributeValue<number>(CharacterAttr.body, 0)
  const physicalMax = Math.ceil(bodyAttr / 2) + 8

  const willpowerAttr = useAttributeValue<number>(CharacterAttr.willpower, 0)
  const stunMax = Math.ceil(willpowerAttr / 2) + 8

  const activeSkills = character.skills
    .filter(skill => skill.type === SkillType.active)
    .map(skill => skill as ActiveSkillData)
  const languageSkills = character.skills
    .filter(skill => skill.type === SkillType.knowledge)
    .map(skill => skill as KnowledgeSkillData)
  const knowledgeSkills = character.skills
    .filter(skill => skill.type === SkillType.language)
    .map(skill => skill as LanguageSkillData)

  return (
    <Paper elevation={1}>
      <Box sx={{ padding: 1 }}>
        <Typography variant="h3">
          {character.alias || character.name}
        </Typography>
        <Typography variant="subtitle1">{character.metaType}</Typography>
      </Box>

      <Box sx={{ padding: 1 }}>
        <AttributeBlock attributes={character.attributes} />
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <Box sx={{ padding: 1, flexGrow: 1 }}>
              <Typography variant={'h6'}>Skills</Typography>
              <ActiveSkillList skills={activeSkills} />
            </Box>

            <Box sx={{ padding: 1, flexGrow: 1 }}>
              <Typography variant={'h6'}>Languages</Typography>
              <LanguageSkillList skills={knowledgeSkills} />
            </Box>

            <Box sx={{ padding: 1, flexGrow: 1 }}>
              <Typography variant={'h6'}>Knowledge</Typography>
              <KnowledgeSkillList skills={languageSkills} />
            </Box>

          </Box>
        </Box>

        <Box sx={{ display: 'flex' }}>
          <Box sx={{ padding: 1 }}>
            <DamageTrack current={0} max={physicalMax} label="Physical" />
          </Box>

          <Box sx={{ padding: 1 }}>
            <DamageTrack current={0} max={stunMax} label="Stun" />
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}
