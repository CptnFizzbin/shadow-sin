import { useSelector } from "@tanstack/react-store"
import type { FC, PropsWithChildren } from "react"
import { Fragment, createContext, useContext } from "react"

import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"

import type { DialogApi } from "./dialogApi.tsx"
import { selectAllDialogs } from "./dialogApiSelectors.ts"

const DialogApiContext = createContext<DialogApi | null>(null)

interface DialogApiProviderProps extends PropsWithChildren {
  dialogApi: DialogApi
}

export const DialogApiProvider: FC<DialogApiProviderProps> = ({ dialogApi, children }) => {
  const dialogsMap = useSelector(dialogApi.store, selectAllDialogs)

  return (
    <DialogApiContext.Provider value={dialogApi}>
      {children}

      {Object.entries(dialogsMap).map(([key, dialog]) => (
        <Fragment key={key}>{dialog}</Fragment>
      ))}
    </DialogApiContext.Provider>
  )
}

export const useDialogApi = () => {
  const dialogApi = useContext(DialogApiContext)

  if (!dialogApi) {
    throw new OutOfContextError("useDialogApi", "DialogApiProvider")
  }

  return dialogApi
}
