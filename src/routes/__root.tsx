import { Container, Divider } from "@mui/material"
import Stack from "@mui/material/Stack"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"

import Footer from "#/components/UI/Footer.tsx"
import { Header } from "#/components/UI/Header.tsx"
import TanStackQueryProvider from "../integrations/tanstack-query/root-provider.tsx"

type RouterContext = object

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

/**
 * Application root layout that wraps the app with providers and renders the header, route outlet, and footer.
 *
 * @returns The root layout element containing the query provider, header, main content container (with the active route Outlet), and footer.
 */
function RootLayout() {
  return (
    <TanStackQueryProvider>
      <Stack direction="column" minHeight="100vh" gap={0}>
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

        <Stack padding={1} gap={1}>
          <Divider />
          <Footer />
        </Stack>
      </Stack>
    </TanStackQueryProvider>
  )
}
