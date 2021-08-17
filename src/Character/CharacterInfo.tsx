import { Paper, Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { DamageTrack } from '../DamageTrack/DamageTrack'
import { AttributeStat } from '../System/Attribute'
import { useAttribute } from '../System/AttributeProvider'
import { ActiveSkillList } from '../System/Skill/ActiveSkillList'
import { KnowledgeSkillList } from '../System/Skill/KnowledgeSkillList'
import { LanguageSkillList } from '../System/Skill/LanguageSkillList'
import { ActiveSkillData, KnowledgeSkillData, LanguageSkillData, SkillType } from '../System/Skill/SkillData'
import { StatBlock } from '../UI/StatBlock'
import { CharacterAttribute } from './CharacterAttribute'
import { useCharacter } from './CharacterProvider'

export const CharacterInfo: FC = () => {
  const { character } = useCharacter()

  const body = useAttribute(CharacterAttribute.body)?.value || 0
  const physicalMax = Math.ceil(body / 2) + 8
  const willpower = useAttribute(CharacterAttribute.willpower)?.value || 0
  const stunMax = Math.ceil(willpower / 2) + 8

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
        <StatBlock>
          {character.attributes.map(attr => (
            <AttributeStat key={attr.name} attr={attr} />
          ))}
        </StatBlock>
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
