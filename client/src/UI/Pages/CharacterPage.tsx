import { Paper } from '@material-ui/core'
import React, { FC, useEffect, useState } from 'react'
import { Redirect, Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom'

import { CharacterData } from '../../Character/CharacterData'
import { CharacterInfo } from '../../Character/CharacterInfo'
import { CharacterProvider } from '../../Character/CharacterProvider'
import { CharacterNavDrawer } from '../NavDrawer/CharacterNavDrawer'
import { AugmentsPage } from './Character/AugmentsPage'
import { MiscGearPage } from './Character/MiscGearPage'
import { VehiclesPage } from './Character/VehiclesPage'
import { WeaponsPage } from './Character/WeaponsPage'
import { RootLayout } from './RootLayout'

export const CharacterPage: FC = () => {
  const history = useHistory()
  const { path } = useRouteMatch()
  const { characterId } = useParams<{ characterId: string }>()
  const [character, setCharacter] = useState<CharacterData | null>(null)

  useEffect(() => {
    const character: CharacterData = JSON.parse(localStorage.getItem(`character.${characterId}`) || 'null')
    if (!character) history.push('/')
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
          <Route path={`${path}/`} component={CharacterInfo} />
          <Route><Redirect to="/" /></Route>
        </Switch>
      </RootLayout>
    </CharacterProvider>
  )
}
