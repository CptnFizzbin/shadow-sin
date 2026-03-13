import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import Footer from "#/components/UI/Footer";
import TanStackQueryProvider from "../integrations/tanstack-query/root-provider";

type RouterContext = object;

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootLayout,
});

function RootLayout() {
	return (
		<TanStackQueryProvider>
			<Stack sx={{ padding: 1 }} direction={"column"} minHeight={"100vh"}>
				<Box sx={{ flexGrow: 1 }}>
					<Outlet />
				</Box>

				<Box>
					<Footer />
				</Box>
			</Stack>
		</TanStackQueryProvider>
	);
}
