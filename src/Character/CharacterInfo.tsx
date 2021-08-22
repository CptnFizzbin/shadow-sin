import { Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { useAttribute } from '../System/AttributeProvider'
import { useDamage, useSetDamage } from '../System/Damage/DamageContext'
import { DamageTrack } from '../System/Damage/DamageTrack'
import { DamageType } from '../System/Damage/DamageType'
import { CharacterDefRatingStat } from '../System/DefenseRating'
import { EdgeTracker } from '../System/Edge/EdgeTracker'
import { CharacterColdVrInit, CharacterHotVrInit, InitiativeStat } from '../System/Initiative'
import { ActiveSkillList } from '../System/Skill/ActiveSkillList'
import { KnowledgeSkillList } from '../System/Skill/KnowledgeSkillList'
import { LanguageSkillList } from '../System/Skill/LanguageSkillList'
import { ActiveSkillData, KnowledgeSkillData, LanguageSkillData, SkillType } from '../System/Skill/SkillData'
import { AttributeBlock } from '../UI/AttributeBlock'
import { DicePools } from '../UI/DicePool'
import { InfoBlock } from '../UI/InfoBlock/InfoBlock'
import { InfoSection } from '../UI/InfoBlock/InfoSection'
import { StatBlock } from '../UI/StatBlock'
import { CharacterAttr } from './CharacterData'
import { useCharacter } from './CharacterProvider'
import { ComposurePool, DodgePool, JudgeIntentPool, LiftPool, MemoryPool, ResistDamagePool } from './DicePools'

export const CharacterInfo: FC = () => {
  const curDamage = useDamage(DamageType.charPhysical)
  const setCurDamage = useSetDamage(DamageType.charPhysical)
  const curStun = useDamage(DamageType.charStun)
  const setCurStun = useSetDamage(DamageType.charStun)

  const { character } = useCharacter()

  const body = useAttribute<number>(CharacterAttr.body) || 0
  const reaction = useAttribute<number>(CharacterAttr.reaction) || 0
  const intuition = useAttribute<number>(CharacterAttr.intuition) || 0
  const willpower = useAttribute<number>(CharacterAttr.willpower) || 0

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
    <InfoBlock>
      <InfoBlock.Header>
        <InfoSection>
          <Typography variant="h3">
            {character.alias || character.name}
          </Typography>
          <Typography variant="subtitle1">{character.metaType}</Typography>
        </InfoSection>

        <InfoSection>
          <AttributeBlock attributes={character.attributes} />
        </InfoSection>
      </InfoBlock.Header>

      <InfoBlock.Body>
        <InfoBlock.Main>
          <InfoSection>
            <EdgeTracker />
          </InfoSection>

          <InfoSection>
            <DicePools>
              <DodgePool />
              <ResistDamagePool />
              <ComposurePool />
              <JudgeIntentPool />
              <MemoryPool />
              <LiftPool />
            </DicePools>
          </InfoSection>

          <InfoSection>
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
          </InfoSection>
        </InfoBlock.Main>

        <InfoBlock.Aside>
          <Box sx={{ padding: 1, paddingBottom: 0 }}>
            <StatBlock vertical>
              {/* NOTE: pg. 67 => changed by augments */}
              <InitiativeStat name="Init" base={reaction + intuition} dice={1} />
              <CharacterHotVrInit />
              <CharacterColdVrInit />
              <CharacterDefRatingStat />
            </StatBlock>
          </Box>

          <Box sx={{ padding: 1 }}>
            <DamageTrack current={curDamage} max={physicalMax} onChange={setCurDamage} label="Physical" />
          </Box>

          <Box sx={{ padding: 1 }}>
            <DamageTrack current={curStun} max={stunMax} onChange={setCurStun} label="Stun" />
          </Box>
        </InfoBlock.Aside>
      </InfoBlock.Body>
    </InfoBlock>
  )
}
