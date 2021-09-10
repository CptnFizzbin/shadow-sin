import React, { FC } from 'react'
import { HashRouter } from 'react-router-dom'

import { AppDataProvider } from './AppDataProvider'
import { AppThemeProvider } from './AppThemeProvider'
import { AppLayout } from './UI/AppLayout'

const App: FC = () => {
  return (
    <HashRouter>
      <AppThemeProvider>
        <AppDataProvider>
          <AppLayout />
        </AppDataProvider>
      </AppThemeProvider>
    </HashRouter>
  )
}

export default App
