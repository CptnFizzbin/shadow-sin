import { purple } from "@mui/material/colors"

import { ReputationStatType } from "#data/reputation/reputationLedgerEntry.ts"

/** Display label and chip/amount colours for each reputation stat. */
export const ReputationStatTypeData: Record<ReputationStatType, {
  label: string
  chipColor: string
  positiveColor: string
  negativeColor: string
}> = {
  [ReputationStatType.streetCred]: {
    label: "Street Cred",
    chipColor: "success.main",
    positiveColor: "success.main",
    negativeColor: "error.main",
  },
  [ReputationStatType.notoriety]: {
    label: "Notoriety",
    chipColor: "error.main",
    positiveColor: "error.main",
    negativeColor: "success.main",
  },
  [ReputationStatType.publicAwareness]: {
    label: "Public Awareness",
    chipColor: purple[400],
    positiveColor: "info.main",
    negativeColor: purple[400],
  },
}
