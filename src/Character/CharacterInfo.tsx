import { Paper, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { useAttribute } from '../System/AttributeProvider'
import { DamageTrack } from '../System/DamageTrack/DamageTrack'
import { EdgeTracker } from '../System/Edge/EdgeTracker'
import { CharacterColdVrInit, CharacterHotVrInit, InitiativeStat } from '../System/Initiative'
import { ActiveSkillList } from '../System/Skill/ActiveSkillList'
import { KnowledgeSkillList } from '../System/Skill/KnowledgeSkillList'
import { LanguageSkillList } from '../System/Skill/LanguageSkillList'
import { ActiveSkillData, KnowledgeSkillData, LanguageSkillData, SkillType } from '../System/Skill/SkillData'
import { AttributeBlock } from '../UI/AttributeBlock'
import { DicePools } from '../UI/DicePool'
import { StatBlock } from '../UI/StatBlock'
import { CharacterAttr, characterAttrNames } from './CharacterData'
import { useCharacter } from './CharacterProvider'
import { DodgePool, ResistDamagePool } from './DicePools'

export const CharacterInfo: FC = () => {
  const theme = useTheme()
  const smScreen = useMediaQuery(theme.breakpoints.down('md'))

  const { character } = useCharacter()

  const body = useAttribute<number>(CharacterAttr.body, 0)
  const reaction = useAttribute<number>(CharacterAttr.reaction, 0)
  const intuition = useAttribute<number>(CharacterAttr.intuition, 0)
  const willpower = useAttribute<number>(CharacterAttr.willpower, 0)
  const edge = useAttribute<number>(CharacterAttr.edge, 0)

  const physicalMax = Math.ceil(body / 2) + 8
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
        <AttributeBlock attributes={character.attributes} names={characterAttrNames} />
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ padding: 1 }}>
            <DicePools>
              <DodgePool />
              <ResistDamagePool />
            </DicePools>
          </Box>

          <Box sx={{ padding: 1 }}>
            <EdgeTracker current={edge} />
          </Box>

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

        <Box sx={{ display: 'flex', flexDirection: smScreen ? 'row' : 'column' }}>
          <Box sx={{ padding: 1, paddingBottom: 0 }}>
            <StatBlock vertical>
              {/* NOTE: pg. 67 => 0changed by augments */}
              <InitiativeStat name="Init" base={reaction + intuition} dice={1} />
              <CharacterHotVrInit />
              <CharacterColdVrInit />
            </StatBlock>
          </Box>

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
