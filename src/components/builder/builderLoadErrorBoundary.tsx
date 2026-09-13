import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { ReactNode } from "react"
import { Component } from "react"

import { clearSavedRunnerDraft } from "#/hooks/builder/useBuilderStores.ts"

interface BuilderLoadErrorBoundaryProps {
  /** Storage key of the draft the wrapped Builder/Editor loads on mount (see `getRunnerStorageKey`). */
  runnerStorageKey: string
  children: ReactNode
}

type BoundaryStatus =
  | "ok" // Rendering `children` normally.
  | "recovering" // A crash was just caught; the draft is being cleared before remounting `children`.
  | "failed" // Clearing the draft and remounting once still crashed; showing the fallback instead.

interface BuilderLoadErrorBoundaryState {
  status: BoundaryStatus
  /** `runnerStorageKey` this boundary has already cleared and retried once for. */
  recoveredForKey: string | null
  /** `runnerStorageKey` as of the last render, so a prop change can be told apart from a retry. */
  lastSeenKey: string
}

/**
 * Recovers the Builder/Editor from a crash on mount by discarding the saved draft it loaded and
 * remounting once. `componentDidCatch`/`getDerivedStateFromError` have no Hook equivalent, so
 * this is a class component despite this repo's usual preference for function components.
 */
export class BuilderLoadErrorBoundary
  extends Component<BuilderLoadErrorBoundaryProps, BuilderLoadErrorBoundaryState> {
  public state: BuilderLoadErrorBoundaryState = {
    status: "ok",
    recoveredForKey: null,
    lastSeenKey: this.props.runnerStorageKey,
  }

  public static getDerivedStateFromError(): Pick<BuilderLoadErrorBoundaryState, "status"> {
    return { status: "recovering" }
  }

  // The Editor route keeps this boundary mounted across a navigation between two runners (only
  // the `runnerId` param changes), so a "failed" status from the previous runner's draft must
  // not stick around and block the next one.
  public static getDerivedStateFromProps(
    props: BuilderLoadErrorBoundaryProps,
    state: BuilderLoadErrorBoundaryState,
  ): Pick<BuilderLoadErrorBoundaryState, "status" | "recoveredForKey" | "lastSeenKey"> | null {
    if (props.runnerStorageKey === state.lastSeenKey) return null
    return { status: "ok", recoveredForKey: null, lastSeenKey: props.runnerStorageKey }
  }

  public componentDidCatch(): void {
    if (this.state.recoveredForKey === this.props.runnerStorageKey) {
      // Already cleared this exact draft and it crashed again — the draft wasn't the cause.
      this.setState({ status: "failed" })
      return
    }

    void clearSavedRunnerDraft(this.props.runnerStorageKey).then(() => {
      this.setState({ status: "ok", recoveredForKey: this.props.runnerStorageKey })
    })
  }

  public render(): ReactNode {
    switch (this.state.status) {
      case "failed":
        return (
          <Stack sx={{ gap: 2, padding: 2 }}>
            <Alert severity="error">
              <AlertTitle>Failed to start the character builder</AlertTitle>
              The saved draft for this character could not be loaded, even after clearing it.
              Reloading the page starts over with a blank draft.
            </Alert>
            <Button variant="outlined" onClick={() => globalThis.location.reload()}>
              Reload
            </Button>
          </Stack>
        )
      case "recovering":
        // Draft-clearing is a single localStorage write; children remount on the next commit.
        return null
      case "ok":
        // Remounts `children` once recovery clears the draft, so the retry starts from a fresh
        // component instance instead of one whose hooks/state may still reflect the crash.
        return <div key={this.state.recoveredForKey ?? "initial"}>{this.props.children}</div>
    }
  }
}
