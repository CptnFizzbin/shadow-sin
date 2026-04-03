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

export const useRootDialogs = () => {
  return {
    add: (id: string, dialog: ReactNode) => {
      rootDialogsStore.setState(produce((prev) => {
        prev[id] = dialog
      }))
    },
    remove: (id: string) => {
      rootDialogsStore.setState(produce((prev) => {
        delete prev[id]
      }))
    },
  }
}
