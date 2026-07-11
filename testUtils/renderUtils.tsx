import { ThemeProvider } from "@mui/material/styles"
import { Store } from "@tanstack/store"
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import type { FC, PropsWithChildren, ReactElement } from "react"
import { useMemo } from "react"
import { afterEach } from "vitest"

import type { BuilderRootState } from "#/components/builder/builderRootState.ts"
import { RunnerBuilderStoreProvider } from "#/components/builder/runnerBuilderStoreProvider.tsx"
import { RunnerDataProvider } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { createDefaultRunnerData } from "#/components/runner/sheet/createDefaultRunnerData.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { theme } from "#/theme.ts"

export const ThemeWrapper: FC<PropsWithChildren> = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

export interface RenderWithProvidersOptions {
  /** Mutate the default `RunnerData` before the store is created. */
  updateRunnerData?: (runnerData: RunnerData) => void
}

export interface RenderInBuilderOptions {
  /** Mutate the default `BuilderRootState` before the root store is created. */
  updateRootState?: (rootState: BuilderRootState) => void
}

export function renderWithProviders(
  element: ReactElement,
  options?: RenderWithProvidersOptions,
) {
  const Wrapper: FC<PropsWithChildren> = ({ children }) => {
    const store = useMemo(() => {
      const runnerData = createDefaultRunnerData()
      options?.updateRunnerData?.(runnerData)
      return new RunnerDataStore(runnerData)
    }, [])
    return (
      <ThemeProvider theme={theme}>
        <RunnerDataProvider store={store}>{children}</RunnerDataProvider>
      </ThemeProvider>
    )
  }

  return render(element, { wrapper: Wrapper })
}

export function renderInBuilder(
  element: ReactElement,
  options?: RenderInBuilderOptions,
) {
  const Wrapper: FC<PropsWithChildren> = ({ children }) => {
    const rootStore = useMemo(() => {
      const rootState: BuilderRootState = {
        runner: createDefaultRunnerData(),
        builder: { startingNuyen: undefined },
      }
      options?.updateRootState?.(rootState)
      return new Store<BuilderRootState>(rootState)
    }, [])
    return (
      <ThemeProvider theme={theme}>
        <RunnerBuilderStoreProvider rootStore={rootStore}>
          {children}
        </RunnerBuilderStoreProvider>
      </ThemeProvider>
    )
  }

  return render(element, { wrapper: Wrapper })
}

/**
 * Fills the "Name" field in the last rendered MUI Dialog and clicks "Save".
 * MUI Dialog uses portals; using the last dialog avoids stale portal nodes
 * left over from previous tests.
 */
export function fillNameAndClickSave(nameValue: string) {
  const dialogs = screen.getAllByRole("dialog")
  const dialog = dialogs[dialogs.length - 1]
  fireEvent.change(within(dialog).getByLabelText(/^name$/i), {
    target: { value: nameValue },
  })
  fireEvent.click(within(dialog).getByRole("button", { name: /save/i }))
}

// Ensure MUI Dialog portals rendered into document.body are cleaned up between tests.
afterEach(() => cleanup())

/**
 * Creates a default RunnerData, optionally mutated by the provided callback.
 * Use this in unit tests to build a sheet with only the fields you care about set.
 */
export function makeRunnerData(overrides?: (sheet: RunnerData) => void): RunnerData {
  const sheet = createDefaultRunnerData()
  overrides?.(sheet)
  return sheet
}

/**
 * Returns a React wrapper component that provides a RunnerDataStore populated
 * from the given sheet. Pass it directly to `renderHook(..., { wrapper })`.
 */
export function makeRunnerDataWrapper(runnerData: RunnerData): FC<PropsWithChildren> {
  const store = new RunnerDataStore(runnerData)
  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerDataProvider store={store}>{children}</RunnerDataProvider>
  )
  Wrapper.displayName = "TestWrapper"
  return Wrapper
}
