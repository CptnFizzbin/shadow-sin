import { createHashHistory, createRouter as createTanStackRouter } from "@tanstack/react-router"

import { createDialogAwareScrollRestoration } from "./hooks/ui/dialog/dialogBackGuard.ts"
import { getContext } from "./integrations/tanstackQuery/rootProvider.tsx"
import { routeTree } from "./routeTree.gen.ts"

export function getRouter() {
  const hashHistory = createHashHistory()

  return createTanStackRouter({
    routeTree,
    history: hashHistory,

    context: getContext(),

    // Opening and closing a dialog moves through history (see useCloseOnBrowserBack); restoring
    // scroll for those moves would jump the page behind the dialog to the top.
    scrollRestoration: createDialogAwareScrollRestoration(),
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
