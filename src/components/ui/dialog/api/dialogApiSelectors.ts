import { createDialogApiSelector } from "./dialogApiStore.ts"

export const selectAllDialogs = createDialogApiSelector((state) => state)
