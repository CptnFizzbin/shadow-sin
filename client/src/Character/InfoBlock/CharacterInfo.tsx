import { useMediaQuery, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import { FC } from 'react'

import { formatNuyen, useNuyenBalance } from '../../System/Nuyen'
import { InfoBlock } from '../../UI/InfoBlock/InfoBlock'
import { Stat } from '../../UI/StatBlock'
import { useCharacterData } from '../CharacterProvider'
import { CombatArea } from './CombatArea'
import { AttributesSection } from './Sections/AttributesSection'
import { DicePoolsSection } from './Sections/DicePoolsSection'
import { EdgeTracker } from './Sections/EdgeTracker'
import { QualitiesSection } from './Sections/QualitiesSection'
import { SkillSection } from './Sections/SkillSection'

export const CharacterInfo: FC = () => {
  const theme = useTheme()
  const mdScreenOrLarger = useMediaQuery(theme.breakpoints.up('md'))
  const character = useCharacterData()
  const nuyenBalance = useNuyenBalance()

  if (!character) return null

  const bio = character.bio
  const karma: number = character.karma.reduce((sum, entry) => sum + entry.value, 0)

  const blockTitleRight = <Box sx={{ fontSize: 10, textAlign: 'right' }}>
    <Stat name="Nuyen" value={formatNuyen(nuyenBalance)} />
    <Stat name="Karma" value={karma} />
  </Box>

  return (
    <InfoBlock
      title={bio.alias || bio.name} subtitle={bio.metatype} titleFontSize={50}
      titleRight={blockTitleRight}
    >
      <AttributesSection />
      <EdgeTracker />

      <Box sx={{ display: 'flex', flexDirection: mdScreenOrLarger ? 'row-reverse' : 'column' }}>
        <CombatArea />

        <Box sx={{ flexGrow: 1 }}>
          <DicePoolsSection />
          <SkillSection />
          <QualitiesSection />
        </Box>
      </Box>
    </InfoBlock>
  )
}
