import { AlertTitle } from "@mui/material"
import Alert from "@mui/material/Alert"
import { sort } from "fast-sort"
import type { FC } from "react"

import { useAllAlerts } from "#/components/CharacterBuilder/Hooks/UseAllAlerts.ts"
import type { AlertInfo } from "#/components/UI/Alerts/AlertInfo.ts"
import { orderBySeverity } from "#/components/UI/Alerts/AlertInfo.ts"

interface AlertsListProps {
  alerts: AlertInfo[]
  includeSummaryOnly?: boolean
}

export const AlertsList: FC<AlertsListProps> = ({
  alerts,
  includeSummaryOnly = false,
}) => {
  const visibleAlerts = includeSummaryOnly
    ? alerts
    : alerts.filter((alert) => !alert.summaryOnly)

  const sortedAlerts = sort(visibleAlerts).by([
    { asc: orderBySeverity },
    { asc: (alert) => alert.section },
    { asc: (alert) => alert.title },
  ])

  return sortedAlerts.map((status, index) => (
    <Alert severity={status.severity} key={index}>
      <AlertTitle>{status.section}: {status.title}</AlertTitle>
      {status.message}
    </Alert>
  ))
}

export const AllBuilderAlerts: FC = () => {
  const statuses = useAllAlerts()
  return <AlertsList alerts={statuses} includeSummaryOnly />
}
