import { Button, Stack } from '@mui/material'
import React, { FC, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { loadCharacters, SavedCharacters } from '../StorageService'
import { RootLayout } from './RootLayout'

export const CharacterListPage: FC = () => {
  const history = useHistory()
  const [characters, setCharacters] = useState<SavedCharacters>({})

  useEffect(() => setCharacters(loadCharacters()), [])

  return (
    <RootLayout>
      <Stack>
        {Object.entries(characters).map(([id, name]) => (
          <Button
            key={id}
            onClick={() => history.push(`/${id}`)}
            sx={{ padding: 1, fontSize: 30, justifyContent: 'flex-start' }}
          >
            {name}
          </Button>
        ))}
      </Stack>
    </RootLayout>
  )
}
