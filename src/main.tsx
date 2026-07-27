import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { RouterProvider } from "@tanstack/react-router"
import React from "react"
import { createRoot } from "react-dom/client"

import TanStackQueryProvider from "./integrations/tanstackQuery/rootProvider.tsx"
import { RunnerManagerProvider } from "./lib/contexts/runner/runnerManagerContext.tsx"
import { getRouter } from "./router.ts"
import { theme } from "./theme.ts"

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
