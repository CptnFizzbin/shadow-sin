import { useStore } from "@tanstack/react-store"

import { useContactsStore } from "#/components/contacts/useContactsStore.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"

export const useContactsAlerts = (): AlertInfo[] => {
  const contactsStore = useContactsStore()

  const alerts: AlertInfo[] = []

  const addAlert = (alert: Omit<AlertInfo, "section">) => {
    alerts.push({ section: "Contacts", ...alert })
  }

  const contacts = useStore(contactsStore, (state) => state)

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
