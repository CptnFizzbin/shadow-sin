import Alert from "@mui/material/Alert"
import { useSelector } from "@tanstack/react-store"
import type { FC, PropsWithChildren, ReactNode } from "react"
import { Component, createContext, useContext } from "react"

import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"

import type { DialogApi } from "./dialogApi.ts"
import { selectAllDialogs } from "./dialogApiSelectors.ts"

const DialogApiContext = createContext<DialogApi | null>(null)

interface DialogApiProviderProps extends PropsWithChildren {
  dialogApi: DialogApi
}

interface DialogBoundaryState {
  error: OutOfContextError | null
}

/**
 * Error boundary that wraps each dialog rendered by {@link DialogApiProvider}.
 * Catches {@link OutOfContextError} and renders a helpful message explaining
 * that a required context provider is missing from the DialogApi outlet's
 * render tree. All other errors are re-thrown so they bubble normally.
 */
class DialogErrorBoundary extends Component<PropsWithChildren, DialogBoundaryState> {
  constructor(props: PropsWithChildren) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: unknown): DialogBoundaryState | null {
    if (error instanceof OutOfContextError) {
      return { error }
    }
    // Re-throw non-OutOfContextError errors so they propagate normally
    throw error
  }

  render(): ReactNode {
    const { error } = this.state
    if (error) {
      return (
        <Alert severity="error">
          <strong>{error.contextName}</strong>
          {" requires "}
          <code>{error.requiredProvider}</code>
          {" to be present in the component tree. Make sure DialogApiProvider is mounted inside the required providers."}
        </Alert>
      )
    }
    return this.props.children
  }
}

export const DialogApiProvider: FC<DialogApiProviderProps> = ({ dialogApi, children }) => {
  const dialogsMap = useSelector(dialogApi.store, selectAllDialogs)

  return (
    <DialogApiContext.Provider value={dialogApi}>
      {children}

      {Object.entries(dialogsMap).map(([key, dialog]) => (
        <DialogErrorBoundary key={key}>
          {dialog}
        </DialogErrorBoundary>
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
