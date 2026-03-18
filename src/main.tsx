import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { RouterProvider } from "@tanstack/react-router"
import React from "react"
import ReactDOM from "react-dom/client"
import { TanStackQueryDevtools } from "#/integrations/tanstack-query/devtools.tsx"
import TanStackQueryProvider from "#/integrations/tanstack-query/root-provider.tsx"
import { TanStackRouterDevtools } from "#/integrations/tanstack-router/devtools.tsx"
import { getRouter } from "./router.ts"
import { theme } from "./theme"

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

        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[TanStackRouterDevtools, TanStackQueryDevtools]}
        />
      </TanStackQueryProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
