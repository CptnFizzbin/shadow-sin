import React, { FC } from 'react'
import { HashRouter } from 'react-router-dom'

import { AppDataProvider } from './AppDataProvider'
import { AppThemeProvider } from './AppThemeProvider'
import { AuthProvider } from './Auth/AuthProvider'
import { AppLayout } from './UI/AppLayout'

const App: FC = () => {
  return (
    <HashRouter>
      <AppThemeProvider>
        <AuthProvider>
          <AppDataProvider>
            <AppLayout />
          </AppDataProvider>
        </AuthProvider>
      </AppThemeProvider>
    </HashRouter>
  )
}

export default App
