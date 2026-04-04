export interface AlertInfo {
  section: string
  severity: "error" | "warning"
  title: string
  message: string
  summaryOnly?: boolean
}

const severityOrder = [
  "error",
  "warning",
]

export const orderBySeverity = (status: AlertInfo) => {
  return severityOrder.indexOf(status.severity)
}
