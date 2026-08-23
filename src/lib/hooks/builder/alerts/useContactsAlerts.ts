import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { ContactsSelectors } from "#/lib/stores/runner/contacts/contactsSlice.selectors.ts"
import { useRunnerSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

export const useContactsAlerts = (): AlertInfo[] => {
  const alerts: AlertInfo[] = []

  const addAlert = (alert: Omit<AlertInfo, "section">) => {
    alerts.push({ section: "Contacts", ...alert })
  }

  const contacts = useRunnerSelector(ContactsSelectors.selectAll)

  if (contacts.length === 0) {
    addAlert({
      severity: "warning",
      title: "No contacts added",
      message: "You have no contacts. Consider adding contacts for connections, favors, and roleplay options.",
      summaryOnly: true,
    })
  } else if (contacts.length < 2) {
    addAlert({
      severity: "warning",
      title: "Fewer than 2 contacts",
      message: "It is recommended to have at least 2 contacts for reliability and roleplay options.",
      summaryOnly: true,
    })
  }

  return alerts
}
