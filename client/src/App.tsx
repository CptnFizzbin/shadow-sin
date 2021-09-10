import React, { FC } from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'

import { AppThemeProvider } from './AppThemeProvider'
import { CharacterListPage } from './UI/Pages/CharacterListPage'
import { CharacterPage } from './UI/Pages/CharacterPage'

const App: FC = () => {
  return (
    <HashRouter>
      <AppThemeProvider>
        <Switch>
          <Route path="/characters" component={CharacterListPage} />
          <Route path="/:characterId" component={CharacterPage} />
          <Route><Redirect to="/characters" /></Route>
        </Switch>
      </AppThemeProvider>
    </HashRouter>
  )
}

export default App
