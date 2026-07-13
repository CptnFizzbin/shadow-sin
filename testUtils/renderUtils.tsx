import { ThemeProvider } from "@mui/material/styles"
import { createStore } from "@tanstack/store"
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import type { FC, PropsWithChildren, ReactElement } from "react"
import { afterEach } from "vitest"

import { builderStateFactory } from "#/components/builder/builderState.ts"
import { BuilderStoreProvider } from "#/components/builder/builderStoreProvider.tsx"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import type { BuilderStore } from "#/stores/builder/builderStore.ts"
import type { RunnerStore } from "#/stores/runner/runnerStore.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { theme } from "#/theme.ts"

export const ThemeWrapper: FC<PropsWithChildren> = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

export interface RenderWithProvidersOptions {
  runnerStore?: RunnerStore
}

export interface RenderInBuilderOptions {
  runnerStore?: RunnerStore
  builderStore?: BuilderStore
}

export function renderWithProviders(
  element: ReactElement,
  {
    runnerStore = createStore(runnerDataFactory()),
  }: RenderWithProvidersOptions = {},
) {
  const Wrapper: FC<PropsWithChildren> = ({ children }) => {
    return (
      <ThemeProvider theme={theme}>
        <RunnerStoreProvider store={runnerStore}>{children}</RunnerStoreProvider>
      </ThemeProvider>
    )
  }

  return render(element, { wrapper: Wrapper })
}

export function renderInBuilder(
  element: ReactElement,
  {
    runnerStore = createStore(runnerDataFactory()),
    builderStore = createStore(builderStateFactory()),
  }: RenderInBuilderOptions = {},
) {
  const Wrapper: FC<PropsWithChildren> = ({ children }) => {
    return (
      <ThemeProvider theme={theme}>
        <BuilderStoreProvider runnerStore={runnerStore} builderStore={builderStore}>
          {children}
        </BuilderStoreProvider>
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
 * Returns a React wrapper component that provides a RunnerDataStore populated
 * from the given sheet. Pass it directly to `renderHook(..., { wrapper })`.
 */
export function makeRunnerDataWrapper(runnerData: RunnerData): FC<PropsWithChildren> {
  const store = createStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )
  Wrapper.displayName = "TestWrapper"

  return Wrapper
}
