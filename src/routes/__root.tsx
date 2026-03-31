import { Container } from "@mui/material"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"

import Footer from "#/components/UI/Footer.tsx"
import { Header } from "#/components/UI/Header.tsx"
import TanStackQueryProvider from "../integrations/tanstack-query/root-provider.tsx"

type RouterContext = object

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

function RootLayout() {
  return (
    <TanStackQueryProvider>
      <Stack gap={1} direction="column" minHeight="100vh">
        <Header />

        <Container sx={{ maxWidth: 1200, mx: "auto", width: "100%", flexGrow: 1 }}>
          <Outlet />
        </Container>

        <Box sx={{ padding: 1 }}>
          <Footer />
        </Box>
      </Stack>
    </TanStackQueryProvider>
  )
}
