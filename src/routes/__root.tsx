import { Container, Divider } from "@mui/material"
import Stack from "@mui/material/Stack"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"

import Footer from "#/components/UI/footer.tsx"
import { Header } from "#/components/UI/header.tsx"
import TanStackQueryProvider from "../integrations/tanstack-query/root-provider.tsx"

type RouterContext = object

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

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

        <Stack padding={1}>
          <Divider />
          <Footer />
        </Stack>
      </Stack>
    </TanStackQueryProvider>
  )
}
