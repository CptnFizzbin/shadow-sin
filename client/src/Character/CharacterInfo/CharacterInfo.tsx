import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { FC } from 'react'

import { ContactList } from '../../Contacts/ContactList'
import { useAllGear } from '../../Gear/GearContext'
import { GearList } from '../../Gear/GearList'
import { isSin } from '../../Gear/License/SinData'
import { formatNuyen, useNuyenBalance } from '../../System/Nuyen'
import { InfoBlock } from '../../UI/InfoBlock/InfoBlock'
import { InfoSection } from '../../UI/InfoBlock/InfoSection'
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
  const nuyenBalance = useNuyenBalance()

  if (!character) return null

  const bio = character.bio
  const karma: number = character.karma.reduce((sum, entry) => sum + entry.value, 0)

  const blockTitleRight = <Box sx={{ fontSize: 10, textAlign: 'right' }}>
    <Stat name="Nuyen" value={formatNuyen(nuyenBalance)} />
    <Stat name="Karma" value={karma} />
  </Box>

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <InfoBlock
        title={bio.alias || bio.name}
        titleFontSize={50}
        titleRight={blockTitleRight}
      >
        <BioSection />
        <AttributesSection />

        <Box sx={{ display: 'flex', flexDirection: mdScreenOrLarger ? 'row-reverse' : 'column' }}>
          <CombatArea />

          <Box sx={{ flexGrow: 1 }}>
            <EdgeTracker />

            <DicePoolsSection />
            <SkillSection />
            <QualitiesSection />

            <InfoSection>
              <Typography variant={'h4'}>Contacts</Typography>
              <ContactList contacts={character.contacts} />
            </InfoSection>

            <InfoSection>
              <Typography variant={'h4'}>SINs</Typography>
              <GearList gear={sins} />
            </InfoSection>
          </Box>
        </Box>
      </InfoBlock>
    </Box>
  )
}
