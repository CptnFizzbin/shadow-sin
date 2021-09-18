import { Box, Button, Typography } from '@material-ui/core'
import React, { FC, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { loadCharacters, SavedCharacter } from '../../StorageService'
import { RootLayout } from './RootLayout'

export const CharacterListPage: FC = () => {
  const history = useHistory()
  const [characters, setCharacters] = useState<SavedCharacter[]>([])

  useEffect(() => setCharacters(loadCharacters()), [])

  return (
    <RootLayout>
      <Box sx={{ overflow: 'auto' }}>
        <Box sx={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: 1 }}>
          {characters.map(character => (
            <Button key={character.id} onClick={() => history.push(`/${character.id}`)} sx={{ padding: 1 }}>
              <Box>
                <Typography sx={{ fontSize: 30 }}>{character.name}</Typography>
                <Typography>{character.metaType}</Typography>
              </Box>
            </Button>
          ))}
        </Box>
      </Box>
    </RootLayout>
  )
}
