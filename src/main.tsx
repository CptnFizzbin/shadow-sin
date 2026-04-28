import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { RouterProvider } from "@tanstack/react-router"
import React from "react"
import { createRoot } from "react-dom/client"

import { DialogApi } from "./components/dialogs/api/dialogApi.ts"
import { DialogApiProvider } from "./components/dialogs/api/dialogApiProvider.tsx"
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
        <DialogApiProvider dialogApi={dialogApi}>
          <CssBaseline />
          <RouterProvider router={router} />
        </DialogApiProvider>
      </TanStackQueryProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
