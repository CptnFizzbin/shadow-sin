import { createDialogApiSelector } from "#/components/dialogs/api/dialogApiStore.ts"

export const selectAllDialogs = createDialogApiSelector((state) => state)
