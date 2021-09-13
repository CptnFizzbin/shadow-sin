import { Box, Typography } from '@material-ui/core'
import React, { FC } from 'react'

import { useCharacter } from '../../../Character/CharacterProvider'
import { CharacterInfo } from '../../../Character/InfoBlock/CharacterInfo'
import { ContactList } from '../../../Contacts/ContactList'
import { useAllGear } from '../../../Gear/GearContext'
import { GearList } from '../../../Gear/GearList'
import { isSin } from '../../../Gear/License/SinData'

export const CharacterInfoPage: FC = () => {
  const character = useCharacter()
  const sins = useAllGear().filter(isSin)
  if (!character) return null

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <CharacterInfo />

      <Box>
        <Typography variant={'h4'}>SINs</Typography>
        <GearList gear={sins} />
      </Box>

      <Box>
        <Typography variant={'h4'}>Contacts</Typography>
        <ContactList contacts={character.contacts} />
      </Box>
    </Box>
  )
}
