import { Box, Paper } from '@material-ui/core'
import React, { FC, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import { useCurrentUser } from '../Auth/AuthProvider'
import { LoginPage } from '../Auth/LoginPage'
import { CharacterPage } from '../Character/CharacterPage'
import { MiscGearPage } from '../Gear/MiscGearPage'
import { VehiclesPage } from '../Gear/Vehicles/VehiclesPage'
import { WeaponsPage } from '../Gear/Weapons/WeaponsPage'
import { NavBar } from './NavBar'
import { NavDrawer } from './NavDrawer'

export const AppLayout: FC = () => {
  const currentUser = useCurrentUser()
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  return (
    <Paper
      sx={{ display: 'grid', gridTemplateRows: 'auto 1fr', bgcolor: 'background.default' }}
      className="App"
    >
      {currentUser ? (
        <>
          <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
          <NavBar onOpenDrawer={() => setDrawerOpen(true)} />
          <Box sx={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: 1, overflow: 'auto' }}>
            <Switch>
              <Route path="/character" component={CharacterPage} />
              <Route path="/weapons" component={WeaponsPage} />
              <Route path="/vehicles" component={VehiclesPage} />
              <Route path="/misc" component={MiscGearPage} />
              <Route><Redirect to="/character" /></Route>
            </Switch>
          </Box>
        </>
      ) : (
        <LoginPage />
      )}
    </Paper>
  )
}
