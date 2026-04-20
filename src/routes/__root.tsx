import { Container, Divider } from "@mui/material"
import Stack from "@mui/material/Stack"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"

import Footer from "#/components/ui/footer.tsx"
import { Header } from "#/components/ui/header.tsx"
import TanStackQueryProvider from "#/integrations/tanstackQuery/rootProvider.tsx"

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
    </TanStackQueryProvider>
  )
}
