import { FC } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { AppThemeProvider } from "./AppThemeProvider"
import { BuilderPage } from "./Character/CharacterBuilder/BuilderPage"
import { CharacterListPage } from "./Pages/CharacterListPage"
import { CharacterPage } from "./Pages/CharacterPage"
import { loadCharacters } from "./StorageService"

loadCharacters()

const App: FC = () => {
  return (
    <BrowserRouter>
      <AppThemeProvider>
        <Routes>
          <Route path="/characters" Component={CharacterListPage} />
          <Route path="/build" Component={BuilderPage} />
          <Route path="/:characterId/*" Component={CharacterPage} />
          <Route path="*" element={<Navigate to="/characters" />} />
        </Routes>
      </AppThemeProvider>
    </BrowserRouter>
  )
}

export default App
