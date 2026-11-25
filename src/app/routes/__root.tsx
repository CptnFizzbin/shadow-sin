import Container from "@mui/material/Container"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"

import Footer from "#app/components/ui/footer.tsx"
import { Header } from "#app/components/ui/header.tsx"
import { ShadowSinDevtools } from "#app/integrations/tanstackDevtools/shadowSinDevtools.tsx"
import { TanStackPacerDevtools } from "#app/integrations/tanstackPacer/devtools.tsx"
import { TanStackQueryDevtools } from "#app/integrations/tanstackQuery/devtools.tsx"
import TanStackQueryProvider from "#app/integrations/tanstackQuery/rootProvider.tsx"
import { TanStackRouterDevtools } from "#app/integrations/tanstackRouter/devtools.tsx"
import { RouterDialogHistoryProvider } from "#app/integrations/tanstackRouter/routerDialogHistory.tsx"

type RouterContext = object

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

/**
 * Render the application shell: a TanStack Query provider wrapping a column layout with the header, routed content outlet, and footer.
 *
 * @returns The root layout element containing the header, routed content, and footer
 */
function RootLayout() {
  return (
    <TanStackQueryProvider>
      <RouterDialogHistoryProvider>
        <Stack direction="column" sx={{ minHeight: "100vh", gap: 0 }}>
          <Header />

          <Container
            disableGutters
            sx={{
              maxWidth: 1200,
              mx: "auto",
              width: "100%",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Outlet />
          </Container>

          <Stack sx={{ padding: 1 }}>
            <Divider />
            <Footer />
          </Stack>
        </Stack>
      </RouterDialogHistoryProvider>

      <TanStackDevtools
        plugins={[
          ShadowSinDevtools,
          TanStackQueryDevtools,
          TanStackRouterDevtools,
          TanStackPacerDevtools,
        ]}
        config={{
          hideUntilHover: true,
        }}
      />
    </TanStackQueryProvider>
  )
}
