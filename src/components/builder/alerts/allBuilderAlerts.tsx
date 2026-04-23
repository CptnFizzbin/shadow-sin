import type { FC } from "react"

import { useAllAlerts } from "#/components/builder/alerts/hooks/useAllAlerts.ts"
import { AlertsList } from "#/components/ui/alerts/alertsList.tsx"

export const AllBuilderAlerts: FC = () => {
  const statuses = useAllAlerts()
  return <AlertsList alerts={statuses} includeSummaryOnly />
}
