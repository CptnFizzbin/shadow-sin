import type { FC } from "react"

import { useAllAlerts } from "#/state/builder/alerts/useAllAlerts.ts"
import { AlertsList } from "#/ui/alerts/alertsList.tsx"

export const AllBuilderAlerts: FC = () => {
  const statuses = useAllAlerts()
  return <AlertsList alerts={statuses} includeSummaryOnly />
}
