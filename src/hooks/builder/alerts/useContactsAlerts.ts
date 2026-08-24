import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ContactsSelectors } from "#/stores/runner/contacts/contactsSlice.selectors.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export const selectContactsAlerts: Selector<{ runner: RunnerData }, AlertInfo[]> = createMemoizedSelector(
  ContactsSelectors.selectAll,
  (contacts): AlertInfo[] => {
    if (contacts.length === 0) {
      return [{
        section: "Contacts",
        severity: "warning",
        title: "No contacts added",
        message: "You have no contacts. Consider adding contacts for connections, favors, and roleplay options.",
        summaryOnly: true,
      }]
    }

    if (contacts.length < 2) {
      return [{
        section: "Contacts",
        severity: "warning",
        title: "Fewer than 2 contacts",
        message: "It is recommended to have at least 2 contacts for reliability and roleplay options.",
        summaryOnly: true,
      }]
    }

    return []
  },
)
