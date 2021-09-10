import { Box, Paper } from '@material-ui/core'
import React, { FC, useEffect, useState } from 'react'
import { Redirect, Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom'

import { CharacterData } from '../../Character/CharacterData'
import { CharacterProvider } from '../../Character/CharacterProvider'
import { AppBar } from '../AppBar'
import { CharacterNavDrawer } from '../NavDrawer/CharacterNavDrawer'
import { CharacterInfoPage } from './CharacterInfoPage'
import { MiscGearPage } from './MiscGearPage'
import { VehiclesPage } from './VehiclesPage'
import { WeaponsPage } from './WeaponsPage'

export const CharacterPage: FC = () => {
  const history = useHistory()
  const { path } = useRouteMatch()
  const { characterId } = useParams<{ characterId: string }>()
  const [character, setCharacter] = useState<CharacterData | null>(null)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  useEffect(() => {
    const character: CharacterData = JSON.parse(localStorage.getItem(`character.${characterId}`) || 'null')
    if (!character) history.push('/')
    setCharacter(character)
  }, [history, characterId])

  if (!character) { return <Paper>Loading...</Paper>}

  return (
    <CharacterProvider character={character}>
      <CharacterNavDrawer open={drawerOpen} closeDrawer={() => setDrawerOpen(false)} />

      <Paper
        sx={{ display: 'grid', gridTemplateRows: 'auto 1fr', bgcolor: 'background.default' }}
        className="App"
        square
      >
        <AppBar withMenu openMenu={() => setDrawerOpen(true)} />

        <Box sx={{ overflow: 'auto' }}>
          <Box sx={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: 1 }}>

            <Switch>
              <Route path={`${path}/weapons`} component={WeaponsPage} />
              <Route path={`${path}/vehicles`} component={VehiclesPage} />
              <Route path={`${path}/misc`} component={MiscGearPage} />
              <Route path={`${path}/`} component={CharacterInfoPage} />
              <Route><Redirect to="/" /></Route>
            </Switch>
          </Box>
        </Box>
      </Paper>
    </CharacterProvider>
  )
}
