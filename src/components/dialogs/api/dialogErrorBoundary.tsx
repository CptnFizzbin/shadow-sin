import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import type { ReactNode } from "react"
import { Component } from "react"

import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"

import type { AnyDialogCtrl } from "./dialogCtrl.ts"

interface DialogErrorBoundaryProps {
  ctrl: AnyDialogCtrl
  onClosed: () => void
  children: ReactNode
}

interface DialogErrorBoundaryState {
  error: OutOfContextError | null
}

/**
 * Error boundary that wraps the dialog component rendered by {@link DialogWrapper}.
 *
 * Placed *inside* `DialogWrapper` so it has access to `ctrl` and `onClosed`.
 * When an {@link OutOfContextError} is caught it:
 * 1. Calls `ctrl.close()` — resolves any pending `result()` promise.
 * 2. Renders an error Alert with a dismiss button.
 * 3. The dismiss button calls `onClosed()` — removes the entry from `DialogApi.store`.
 *
 * All other errors are re-thrown so they bubble normally.
 */
export class DialogErrorBoundary extends Component<DialogErrorBoundaryProps, DialogErrorBoundaryState> {
  constructor(props: DialogErrorBoundaryProps) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: unknown): DialogErrorBoundaryState | null {
    if (error instanceof OutOfContextError) {
      return { error }
    }
    // Re-throw non-OutOfContextError errors so they propagate normally
    throw error
  }

  componentDidCatch(error: unknown): void {
    if (error instanceof OutOfContextError) {
      // Resolve the pending result() promise so callers are not left hanging
      this.props.ctrl.close()
    }
  }

  render(): ReactNode {
    const { error } = this.state
    if (error) {
      return (
        <Alert
          severity="error"
          action={(
            <Button color="inherit" size="small" onClick={this.props.onClosed}>
              Dismiss
            </Button>
          )}
        >
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
