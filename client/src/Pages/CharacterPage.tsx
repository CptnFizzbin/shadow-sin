import { Paper } from '@mui/material'
import React, { FC, useEffect, useState } from 'react'
import { Redirect, Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom'

import { CharacterData } from '../Character/CharacterData'
import { CharacterProvider } from '../Character/CharacterProvider'
import { loadCharacter } from '../StorageService'
import { CharacterNavDrawer } from '../UI/NavDrawer/CharacterNavDrawer'
import { AugmentsPage } from './Character/AugmentsPage'
import { CharacterInfoPage } from './Character/CharacterInfoPage'
import { KarmaPage } from './Character/KarmaPage'
import { MiscGearPage } from './Character/MiscGearPage'
import { NuyenPage } from './Character/NuyenPage'
import { VehiclesPage } from './Character/VehiclesPage'
import { WeaponsPage } from './Character/WeaponsPage'
import { RootLayout } from './RootLayout'

export const CharacterPage: FC = () => {
  const history = useHistory()
  const { path } = useRouteMatch()
  const { characterId } = useParams<{ characterId: string }>()
  const [character, setCharacter] = useState<CharacterData | null>(null)

  useEffect(() => {
    const character: CharacterData | null = loadCharacter(characterId)
    if (character === null) history.push('/')
    setCharacter(character)
  }, [history, characterId])

  if (!character) { return <Paper>Loading...</Paper>}

  return (
    <CharacterProvider character={character}>
      <RootLayout NavDrawer={CharacterNavDrawer}>
        <Switch>
          <Route path={`${path}/weapons`} component={WeaponsPage} />
          <Route path={`${path}/vehicles`} component={VehiclesPage} />
          <Route path={`${path}/augments`} component={AugmentsPage} />
          <Route path={`${path}/misc`} component={MiscGearPage} />
          <Route path={`${path}/karma`} component={KarmaPage} />
          <Route path={`${path}/nuyen`} component={NuyenPage} />
          <Route path={`${path}/`} component={CharacterInfoPage} />
          <Route><Redirect to="/" /></Route>
        </Switch>
      </RootLayout>
    </CharacterProvider>
  )
}
