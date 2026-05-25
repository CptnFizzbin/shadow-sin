import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { RouterProvider } from "@tanstack/react-router"
import React from "react"
import { createRoot } from "react-dom/client"

import { CharacterManagerProvider } from "./character/characterManagerContext.tsx"
import { DialogApi } from "./components/ui/dialog/api/dialogApi.tsx"
import { DialogApiProvider } from "./components/ui/dialog/api/dialogApiProvider.tsx"
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
        <CharacterManagerProvider>
          <DialogApiProvider dialogApi={dialogApi}>
            <CssBaseline />
            <RouterProvider router={router} />
          </DialogApiProvider>
        </CharacterManagerProvider>
      </TanStackQueryProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
