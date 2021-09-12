import { Box, Typography } from '@material-ui/core'
import React, { FC } from 'react'

import { CharacterInfo } from '../../../Character/CharacterInfo'
import { useCharacter } from '../../../Character/CharacterProvider'
import { ContactList } from '../../../Contacts/ContactList'

export const CharacterInfoPage: FC = () => {
  const character = useCharacter()
  if (!character) return null

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <CharacterInfo />

      <Box>
        <Typography variant={'h4'}>Contacts</Typography>
        <ContactList contacts={character.contacts} />
      </Box>
    </Box>
  )
}
