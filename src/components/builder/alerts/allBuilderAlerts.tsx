import type { FC } from "react"

import { AlertsList } from "#/components/ui/alerts/alertsList.tsx"

import { useAllAlerts } from "./hooks/useAllAlerts.ts"

export const AllBuilderAlerts: FC = () => {
  const statuses = useAllAlerts()
  return <AlertsList alerts={statuses} includeSummaryOnly />
}
