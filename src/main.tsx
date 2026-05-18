import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { RouterProvider } from "@tanstack/react-router"
import React from "react"
import { createRoot } from "react-dom/client"

import { CharacterManagerProvider } from "./character/characterManagerContext.tsx"
import { DialogApi } from "./components/dialogs/api/dialogApi.tsx"
import { DialogApiProvider } from "./components/dialogs/api/dialogApiProvider.tsx"
import { GameConfigProvider } from "./components/gameConfig/gameConfigProvider.tsx"
import TanStackQueryProvider from "./integrations/tanstackQuery/rootProvider.tsx"
import { getRouter } from "./router.ts"
import { theme } from "./theme.ts"

const router = getRouter()
const rootElement = document.getElementById("root")
const dialogApi = new DialogApi()

if (!rootElement) {
  throw new Error("Root element not found")
}

createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme} defaultMode="dark">
      <TanStackQueryProvider>
        <GameConfigProvider>
          <CharacterManagerProvider>
            <DialogApiProvider dialogApi={dialogApi}>
              <CssBaseline />
              <RouterProvider router={router} />
            </DialogApiProvider>
          </CharacterManagerProvider>
        </GameConfigProvider>
      </TanStackQueryProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
