import { Box, Button, Typography } from '@material-ui/core'
import React, { FC, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { RecordId } from '../../Api/Model'
import { CharacterData } from '../../Character/CharacterData'
import Artemis from '../../data/Artemis.json'
import Silicus from '../../data/Silicus.json'
import { RootLayout } from './RootLayout'

type SavedCharacter = {
  id: RecordId
  name: string
  metaType: string
}

const DEBUG_LOAD = true
if (DEBUG_LOAD || !localStorage.getItem('characters')) {
  const characters = [Artemis, Silicus] as unknown as CharacterData[]
  characters.forEach(character => localStorage.setItem(`character.${character.id}`, JSON.stringify(character)))

  localStorage.setItem('characters', JSON.stringify(
    characters.map(character => ({
      id: character.id,
      name: character.name,
      metaType: character.metaType,
    })),
  ))
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
