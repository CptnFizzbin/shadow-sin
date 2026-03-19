import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { RouterProvider } from "@tanstack/react-router"
import React from "react"
import ReactDOM from "react-dom/client"
import TanStackQueryProvider from "#/integrations/tanstack-query/root-provider.tsx"
import { getRouter } from "./router.ts"
import { theme } from "./theme.ts"

const router = getRouter()
const rootElement = document.getElementById("root")

if (!rootElement) {
  throw new Error("Root element not found")
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <TanStackQueryProvider>
        <CssBaseline />
        <RouterProvider router={router} />
      </TanStackQueryProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
