import { Box, Paper } from '@material-ui/core'
import React, { FC, useState } from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'

import { AppDataProvider } from './AppDataProvider'
import { AppThemeProvider } from './AppThemeProvider'
import { CharacterPage } from './Character/CharacterPage'
import { MiscGearPage } from './Gear/MiscGearPage'
import { VehiclesPage } from './Gear/Vehicles/VehiclesPage'
import { WeaponsPage } from './Gear/Weapons/WeaponsPage'
import { NavBar } from './UI/NavBar'
import { NavDrawer } from './UI/NavDrawer'

const App: FC = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  return (
    <HashRouter>
      <AppThemeProvider>
        <AppDataProvider>
          <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
          <Paper sx={{ display: 'grid', gridTemplateRows: 'auto 1fr', bgcolor: 'background.default' }} className="App">
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
          </Paper>
        </AppDataProvider>
      </AppThemeProvider>
    </HashRouter>
  )
}

export default App
