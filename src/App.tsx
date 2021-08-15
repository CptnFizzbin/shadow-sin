import { Paper } from '@material-ui/core'
import React, { FC } from 'react'

import { AppDataProvider } from './AppDataProvider'
import { AppThemeProvider } from './AppThemeProvider'
import { CharacterSheet } from './CharacterSheet'
import { NavBar } from './UI/NavBar'

const App: FC = () => {
  return (
    <AppThemeProvider>
      <Paper square sx={{ bgcolor: 'background.default' }} className="App">
        <AppDataProvider>
          <NavBar />
          <CharacterSheet />
        </AppDataProvider>
      </Paper>
    </AppThemeProvider>
  )
}

export default App
