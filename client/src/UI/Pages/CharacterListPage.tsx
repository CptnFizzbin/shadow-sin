import { Box, Button, Typography } from '@material-ui/core'
import React, { FC, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { RecordId } from '../../Api/Model'
import { Artemis } from '../../data/Artemis'
import { Silicus } from '../../data/Silicus'
import { RootLayout } from './RootLayout'

type SavedCharacter = {
  id: RecordId
  name: string
  metaType: string
}

const DEBUG_LOAD = true
if (DEBUG_LOAD || !localStorage.getItem('characters')) {
  const savedCharacters: SavedCharacter[] = [Artemis, Silicus]
    .map(character => {
      localStorage.setItem(`character.${character.id}`, JSON.stringify(character))
      return { id: character.id, name: character.name, metaType: character.metaType }
    })
  localStorage.setItem('characters', JSON.stringify(savedCharacters))
}

export const CharacterListPage: FC = () => {
  const history = useHistory()
  const [characters, setCharacters] = useState<SavedCharacter[]>([])

  useEffect(() => {
    const savedCharacters: SavedCharacter[] = JSON.parse(localStorage.getItem('characters') || '[]')
    setCharacters(savedCharacters)
  }, [])

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
