import { Paper, Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { DamageTrack } from '../DamageTrack/DamageTrack'
import { StatBlock } from '../UI/StatBlock'
import { AttributeStat } from './Attribute'
import { useAttribute, useCharacter } from './CharacterContext'
import { SkillList } from './Skill'

export const CharacterInfo: FC = () => {
  const { character } = useCharacter()

  const body = useAttribute('body', 0)
  const physicalMax = Math.ceil(body / 2) + 8
  const will = useAttribute('willpower', 0)
  const stunMax = Math.ceil(will / 2) + 8

  return (
    <Box sx={{ paddingTop: 1 }}>
      <Paper elevation={1}>
        <Box sx={{ padding: 1 }}>
          <Typography variant="h3">
            {character.alias || character.name}
          </Typography>
          <Typography variant="subtitle1">{character.metaType}</Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ paddingTop: 1 }}>
                <Typography variant={'h5'}>Attributes</Typography>
                <StatBlock>
                  {Object.entries(character.attributes).map(([attr, value]) => (
                    <AttributeStat key={attr} attr={attr} value={value} />
                  ))}
                </StatBlock>
              </Box>

              <Box sx={{ paddingTop: 1 }}>
                <SkillList character={character} />
              </Box>
            </Box>

            <Box sx={{ paddingLeft: 1, paddingTop: 1, display: 'flex' }}>
              <DamageTrack current={0} max={physicalMax} label="Physical" />

              <Box sx={{ paddingLeft: 1 }}>
                <DamageTrack current={0} max={stunMax} label="Stun" />
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
