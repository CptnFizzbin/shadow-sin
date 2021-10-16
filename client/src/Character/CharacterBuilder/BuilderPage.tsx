import { Paper, Stack, Typography } from '@mui/material'
import { FC, useState } from 'react'

import { RootLayout } from '../../Pages/RootLayout'
import { CharacterNavDrawer } from '../../UI/NavDrawer/CharacterNavDrawer'
import { CharacterAttr } from '../CharacterAttr'
import { CharacterData } from '../CharacterData'
import { BioSection } from './BioSection'
import { PriorityValues } from './Priorities/Priorities'
import { PrioritiesTable } from './Priorities/PrioritiesTable'

const defaultCharacter: CharacterData = {
  dataVersion: 3,

  bio: {
    name: '',
    metatype: '',
    role: '',
    alias: '',
    ethnicity: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
  },

  karma: [],
  nuyen: [],

  attributes: {
    [CharacterAttr.body]: 0,
    [CharacterAttr.agility]: 0,
    [CharacterAttr.reaction]: 0,
    [CharacterAttr.strength]: 0,
    [CharacterAttr.willpower]: 0,
    [CharacterAttr.logic]: 0,
    [CharacterAttr.intuition]: 0,
    [CharacterAttr.charisma]: 0,
    [CharacterAttr.edge]: 0,
    [CharacterAttr.magic]: 0,
    [CharacterAttr.resonance]: 0,
  },

  heat: '',
  reputation: '',
  lifestyle: { grade: '', prepaid: 0, upkeep: 0 },

  qualities: [],
  skills: [],
  contacts: [],

  gear: [],
}

export const BuilderPage: FC = () => {
  const [priorities, setPriorities] = useState<PriorityValues>({
    adjustmentPoints: 0,
    attributePoints: 0,
    magic: 0,
    metatypes: [],
    nuyen: 0,
    skillPoints: 0,
  })
  const [characterData, setCharacterData] = useState<CharacterData>(defaultCharacter)

  return (
    <RootLayout NavDrawer={CharacterNavDrawer}>
      <Stack gap={1}>
        <Paper variant="outlined" sx={{ padding: 1 }}>
          <Typography variant="h3">Bio</Typography>
          <BioSection
            bio={characterData.bio}
            onChange={bio => setCharacterData({ ...characterData, bio })}
            metatypes={priorities.metatypes}
          />
        </Paper>

        <Paper variant="outlined" sx={{ padding: 1 }}>
          <Typography variant="h3">Priorities</Typography>
          <PrioritiesTable onChange={setPriorities} />
        </Paper>
      </Stack>
    </RootLayout>
  )
}
