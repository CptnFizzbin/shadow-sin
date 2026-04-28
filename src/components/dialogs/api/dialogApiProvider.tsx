import { useSelector } from "@tanstack/react-store"
import type { FC, PropsWithChildren } from "react"
import { createContext, Fragment, useContext } from "react"

import type { DialogApi } from "./dialogApi.ts"
import { selectAllDialogs } from "./dialogApiSelectors.ts"
import { OutOfContextError } from "./outOfContextError.ts"

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
        <Fragment key={key}>
          {dialog}
        </Fragment>
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
