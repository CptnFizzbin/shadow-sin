import { createFileRoute } from "@tanstack/react-router"

import { FinancesPage } from "#/components/finances/financesPage.tsx"

export const Route = createFileRoute("/$characterId/finances")({
  component: FinancesPage,
})
