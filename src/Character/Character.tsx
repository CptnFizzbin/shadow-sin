import { Paper, Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { GearData } from '../Gear/GearData'
import { StatBlock } from '../UI/StatBlock'
import { Attribute, AttributeStat } from './Attribute'
import { useCharacter } from './CharacterContext'
import { Skill, SkillList } from './Skill'

export interface Character {
  name: string
  metaType: string
  nuyen: number

  alias?: string
  ethnicity?: string
  age?: number
  gender?: string
  height?: string
  weight?: string
  reputation?: string
  heat?: string
  karma: number
  misc?: string

  attributes: {
    [Attr in Attribute]?: number
  }

  skills: Skill[]

  gear: GearData[]
}

export const CharacterInfo: FC = () => {
  const { character } = useCharacter()

  return (
    <Box sx={{ paddingTop: 1 }}>
      <Paper elevation={1}>
        <Box sx={{ padding: 1 }}>
          <Typography variant="h3">
            {character.alias || character.name}
          </Typography>
          <Typography variant="subtitle1">{character.metaType}</Typography>

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
      </Paper>
    </Box>
  )
}
