import React, { FC } from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'

import { AppThemeProvider } from './AppThemeProvider'
import { AuthProvider } from './Auth/AuthProvider'
import { BuilderPage } from './Character/CharacterBuilder/BuilderPage'
import { CharacterListPage } from './Pages/CharacterListPage'
import { CharacterPage } from './Pages/CharacterPage'
import { loadCharacters } from './StorageService'

loadCharacters()

const App: FC = () => {
  return (
    <HashRouter>
      <AppThemeProvider>
        <AuthProvider>
          <Switch>
            <Route path="/characters" component={CharacterListPage} />
            <Route path="/build" component={BuilderPage} />
            <Route path="/:characterId" component={CharacterPage} />
            <Route><Redirect to="/characters" /></Route>
          </Switch>
        </AuthProvider>
      </AppThemeProvider>
    </HashRouter>
  )
}

export default App
