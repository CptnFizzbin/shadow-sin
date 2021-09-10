import { Box, Button, Paper } from '@material-ui/core'
import React, { FC, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { RecordId } from '../../Api/Model'
import { Artemis } from '../../data/Artemis'
import { AppBar } from '../AppBar'

type SavedCharacter = { id: RecordId; name: string }

if (!localStorage.getItem('characters')) {
  localStorage.setItem(`character.${Artemis.id}`, JSON.stringify(Artemis))
  localStorage.setItem('characters', JSON.stringify([
    { id: Artemis.id, name: Artemis.name },
  ]))
}

export const CharacterListPage: FC = () => {
  const history = useHistory()
  const [characters, setCharacters] = useState<SavedCharacter[]>([])

  useEffect(() => {
    const savedCharacters: SavedCharacter[] = JSON.parse(localStorage.getItem('characters') || '[]')
    setCharacters(savedCharacters)
  }, [])

  return (
    <Box>
      <Paper
        sx={{ display: 'grid', gridTemplateRows: 'auto 1fr', bgcolor: 'background.default' }}
        className="App"
        square
      >
        <AppBar />

        <Box sx={{ overflow: 'auto' }}>
          <Box sx={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: 1 }}>
            {characters.map(character => (
              <Button key={character.id}>
                <div onClick={() => history.push(`/${character.id}`)}>{character.name}</div>
              </Button>
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
