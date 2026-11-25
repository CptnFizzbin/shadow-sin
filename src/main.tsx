import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { RouterProvider } from "@tanstack/react-router"
import React from "react"
import { createRoot } from "react-dom/client"

import TanStackQueryProvider from "./app/integrations/tanstackQuery/rootProvider.tsx"
import { getRouter } from "./router.ts"
import { RunnerManagerProvider } from "./state/persistence/runnerManager.provider.tsx"
import { theme } from "./ui/theme/theme.ts"

const router = getRouter()
const rootElement = document.getElementById("root")

if (!rootElement) {
  throw new Error("Root element not found")
}

createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme} defaultMode="dark">
      <TanStackQueryProvider>
        <RunnerManagerProvider>
          <CssBaseline />
          <RouterProvider router={router} />
        </RunnerManagerProvider>
      </TanStackQueryProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
