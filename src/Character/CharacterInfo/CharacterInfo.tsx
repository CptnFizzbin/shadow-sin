import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { FC } from 'react'

import { ContactList } from '../../Contacts/ContactList'
import { useAllGear } from '../../Gear/GearContext'
import { GearList } from '../../Gear/GearList'
import { isSin } from '../../Gear/License/SinData'
import { calcNuyenBalance, formatNuyen } from '../../System/Nuyen'
import { InfoBlock } from '../../UI/InfoBlock/InfoBlock'
import { Stat } from '../../UI/StatBlock'
import { useCharacterData } from '../CharacterProvider'
import { AttributesSection } from './AttributesSection'
import { BioSection } from './BioSection'
import { CombatArea } from './CombatArea'
import { DicePoolsSection } from './DicePoolsSection'
import { EdgeTracker } from './EdgeTracker'
import { QualitiesSection } from './QualitiesSection'
import { SkillSection } from './SkillSection'

export const CharacterInfo: FC = () => {
  const character = useCharacterData()
  const sins = useAllGear().filter(isSin)
  const theme = useTheme()
  const mdScreenOrLarger = useMediaQuery(theme.breakpoints.up('md'))

  if (!character) return null

  const bio = character.bio
  const karma: number = character.karma.reduce((sum, entry) => sum + entry.value, 0)
  const nuyen = calcNuyenBalance(character.nuyen)

  const blockTitleRight = <Box sx={{fontSize: 10, textAlign: 'right'}}>
    <Stat name="Nuyen" value={formatNuyen(nuyen)} />
    <Stat name="Karma" value={karma} />
  </Box>

  return (
    <Stack direction="column" gap={1}>
      <InfoBlock
        title={bio.alias || bio.name}
        titleFontSize={50}
        titleRight={blockTitleRight}
      >
        <BioSection />
        <AttributesSection />

        <Stack gap={1} direction={mdScreenOrLarger ? 'row-reverse' : 'column'}>
          <CombatArea />

          <Stack gap={1} sx={{flexGrow: 1}}>
            <EdgeTracker />

            <DicePoolsSection />
            <SkillSection />
            <QualitiesSection />

            <Typography variant={'h4'}>Contacts</Typography>
            <ContactList contacts={character.contacts} />

            <Typography variant={'h4'}>SINs</Typography>
            <GearList gear={sins} />
          </Stack>
        </Stack>
      </InfoBlock>
    </Stack>
  )
}
