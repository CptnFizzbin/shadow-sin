export interface AlertInfo {
  section: string
  severity: "error" | "warning"
  title: string
  message: string
}

const severityOrder = [
  "error",
  "warning",
]

export const orderBySeverity = (status: AlertInfo) => {
  return severityOrder.indexOf(status.severity)
}
