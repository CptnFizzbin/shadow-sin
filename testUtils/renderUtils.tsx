import { ThemeProvider } from "@mui/material/styles"
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import type { FC, PropsWithChildren, ReactElement } from "react"
import { afterEach } from "vitest"

import { builderStateFactory } from "#/components/builder/builderState.ts"
import { BuilderStoreProvider } from "#/components/builder/builderStoreProvider.tsx"
import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { createCompatStore } from "#/integrations/reduxToolkit/compatStore.ts"
import { builderStoreReducer } from "#/lib/stores/builder/builderStore.reducer.ts"
import type { BuilderStore } from "#/lib/stores/builder/builderStore.ts"
import type { RunnerStore } from "#/lib/stores/runner/runnerStore.ts"
import type { ItemData } from "#/system/itemData.ts"
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
    runnerStore = new RunnerDataStore(runnerDataFactory()),
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

/**
 * Seeds a fresh `RunnerDataStore`'s gear from the given map and renders `element` under it via
 * `renderWithProviders` — the `new RunnerDataStore(runnerDataFactory((runner) => ({ ...runner,
 * gear })))` boilerplate every typed-card unit test (`SinDataCard`, `DeviceDataCard`, ...)
 * otherwise repeats for itself. Returns the store so callers can assert against it or seed a
 * reactive wrapper component keyed off it.
 */
export function renderWithRunner(element: ReactElement, gear: Record<string, ItemData>) {
  const runnerStore = new RunnerDataStore(runnerDataFactory((runner) => ({ ...runner, gear })))
  renderWithProviders(element, { runnerStore })
  return runnerStore
}

export function renderInBuilder(
  element: ReactElement,
  {
    runnerStore = new RunnerDataStore(runnerDataFactory()),
    builderStore = createCompatStore(builderStateFactory(), builderStoreReducer),
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
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )
  Wrapper.displayName = "TestWrapper"

  return Wrapper
}
