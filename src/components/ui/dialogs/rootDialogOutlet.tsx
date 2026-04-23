import { useStore } from "@tanstack/react-store"
import { createStore } from "@tanstack/store"
import { produce } from "immer"
import type { ReactNode, FC } from "react"

const rootDialogsStore = createStore<Record<string, ReactNode>>({})

export const RootDialogOutlet: FC = () => {
  const dialogsMap = useStore(rootDialogsStore, (state) => state)

  return Object.entries(dialogsMap).map(([key, dialog]) => (
    <div key={key}>{dialog}</div>
  ))
}

export const addRootDialog = (id: string, dialog: ReactNode): void => {
  rootDialogsStore.setState(produce((prev) => {
    prev[id] = dialog
  }))
}

export const removeRootDialog = (id: string): void => {
  rootDialogsStore.setState(produce((prev) => {
    delete prev[id]
  }))
}

export const clearRootDialogs = (): void => {
  rootDialogsStore.setState(() => ({}))
}

export const useRootDialogs = () => {
  return {
    add: addRootDialog,
    remove: removeRootDialog,
  }
}
