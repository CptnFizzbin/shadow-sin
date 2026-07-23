import Container from "@mui/material/Container"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"

import { dicePoolPrototypeVersions } from "#/components/system/dicePool/prototype/dicePoolPrototypeVersions.ts"
import Footer from "#/components/ui/footer.tsx"
import { Header } from "#/components/ui/header.tsx"
import { Prototype } from "#/components/ui/prototype/prototype.tsx"
import { ShadowSinDevtools } from "#/integrations/tanstackDevtools/shadowSinDevtools.tsx"
import { TanStackPacerDevtools } from "#/integrations/tanstackPacer/devtools.tsx"
import { TanStackQueryDevtools } from "#/integrations/tanstackQuery/devtools.tsx"
import TanStackQueryProvider from "#/integrations/tanstackQuery/rootProvider.tsx"
import { TanStackRouterDevtools } from "#/integrations/tanstackRouter/devtools.tsx"

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
      <Prototype versions={dicePoolPrototypeVersions}>
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

          <Stack sx={{ padding: 1, gap: 1 }}>
            <Divider />
            <Footer />
          </Stack>
        </Stack>
      </Prototype>
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
