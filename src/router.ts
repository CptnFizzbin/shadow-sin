import { createHashHistory, createRouter as createTanStackRouter } from "@tanstack/react-router"

import { getContext } from "./app/integrations/tanstackQuery/rootProvider.tsx"
import { createDialogAwareScrollRestoration } from "./app/integrations/tanstackRouter/dialogAwareScrollRestoration.ts"
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
