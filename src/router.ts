import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { getContext } from "./integrations/tanstack-query/root-provider.tsx"
import { routeTree } from "./routeTree.gen.ts"

export function getRouter() {
  return createTanStackRouter({
    routeTree,

    context: getContext(),

    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  })
}

declare module "@tanstack/react-router" {
  // noinspection JSUnusedGlobalSymbols
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
