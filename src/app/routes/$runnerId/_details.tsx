import { createFileRoute, Outlet } from "@tanstack/react-router"

/**
 * Full-screen drill-down pages (e.g. item details) — no `RunnerNav`/swipe
 * chrome, sibling to `_viewer`. Pathless, so it doesn't add a URL segment.
 * Each page under here is responsible for its own back navigation.
 */
export const Route = createFileRoute("/$runnerId/_details")({
  component: () => <Outlet />,
})
