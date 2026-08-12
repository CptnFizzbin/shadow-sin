import Alert from "@mui/material/Alert"
import { differenceInCalendarDays } from "date-fns"
import type { FC } from "react"

import { selectLastExportDate } from "#/lib/stores/runner/meta/metaSlice.selectors.ts"
import { useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

const BACKUP_REMINDER_THRESHOLD_DAYS = 7

/**
 * Warns the player to export a backup of their runner when it's been more than
 * {@link BACKUP_REMINDER_THRESHOLD_DAYS} days since the last export (or when it has never been exported).
 */
export const BackupReminderNotice: FC = () => {
  const lastExportDate = useRunnerStoreSelector(selectLastExportDate)

  const daysSinceExport = lastExportDate
    ? differenceInCalendarDays(new Date(), new Date(lastExportDate))
    : null

  if (daysSinceExport !== null && daysSinceExport <= BACKUP_REMINDER_THRESHOLD_DAYS) return null

  return (
    <Alert severity="warning">
      {lastExportDate
        ? `It's been ${daysSinceExport} days since you last exported this runner. Back it up regularly to avoid losing progress.`
        : "You haven't exported this runner yet. Back it up regularly to avoid losing progress."}
    </Alert>
  )
}
