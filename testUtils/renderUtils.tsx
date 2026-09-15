import { ThemeProvider } from "@mui/material/styles"
import { createMemoryHistory, createRootRoute, createRouter, RouterContextProvider } from "@tanstack/react-router"
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import type { FC, PropsWithChildren, ReactElement } from "react"
import { useMemo } from "react"
import { afterEach } from "vitest"

import type { BuilderState } from "#/components/builder/builderState.ts"
import { AddItemDialogProvider } from "#/components/entities/items/dialogs/addItemDialogProvider.tsx"
import { RunnerEntityProvider } from "#/components/runner/runnerEntityProvider.tsx"
import { RunnerStoreProvider } from "#/components/runner/runnerStoreProvider.tsx"
import { BuilderActions } from "#/state/builder/builderStore.actions.ts"
import type { RunnerStateStore } from "#/state/runnerState.ts"
import { RunnerStateProvider, createRunnerStateStore } from "#/state/runnerState.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"
import { theme } from "#/theme.ts"

export const ThemeWrapper: FC<PropsWithChildren> = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

/**
 * Provides `@tanstack/react-router` context so components under test can call
 * `useNavigate`/`useRouter` (e.g. to open an item's detail route) without
 * logging "useRouter must be used inside a <RouterProvider> component!" on
 * every render. Uses `RouterContextProvider` rather than `RouterProvider`:
 * it only supplies the router via context, it doesn't render matched routes,
 * so a bare root route is enough and no route loaders run.
 */
const TestRouterProvider: FC<PropsWithChildren> = ({ children }) => {
  const router = useMemo(
    () => createRouter({ routeTree: createRootRoute(), history: createMemoryHistory() }),
    [],
  )
  return <RouterContextProvider router={router}>{children}</RouterContextProvider>
}

export interface RenderWithProvidersOptions {
  runner?: RunnerData
}

/**
 * Renders `element` under a real `RunnerState` store (`mode: "viewer"`), seeded from `runner`.
 * Returns the store itself — assert against `store.getState().runner`, drive it with
 * `store.dispatch(...)`, same as any other `RunnerState` consumer.
 */
export function renderWithProviders(
  element: ReactElement,
  { runner = runnerDataFactory() }: RenderWithProvidersOptions = {},
): RunnerStateStore {
  const store = createRunnerStateStore({ mode: "viewer", runner })

  const Wrapper: FC<PropsWithChildren> = ({ children }) => {
    return (
      <ThemeProvider theme={theme}>
        <TestRouterProvider>
          <RunnerStoreProvider store={store}>
            <AddItemDialogProvider>{children}</AddItemDialogProvider>
          </RunnerStoreProvider>
        </TestRouterProvider>
      </ThemeProvider>
    )
  }

  render(element, { wrapper: Wrapper })
  return store
}

/**
 * Seeds a fresh Runner's gear from the given map and renders `element` under it via
 * `renderWithProviders` — the `runnerDataFactory({ items: gear })` boilerplate every typed-card
 * unit test (`SinDataCard`, `DeviceDataCard`, ...) otherwise repeats for itself. Returns the store
 * so callers can assert against it or seed a reactive wrapper component keyed off it.
 */
export function renderWithRunner(element: ReactElement, gear: Record<string, ItemData> = {}): RunnerStateStore {
  return renderWithProviders(element, { runner: runnerDataFactory({ items: gear }) })
}

export interface RenderInBuilderOptions {
  runner?: RunnerData
  builder?: Partial<BuilderState>
}

/**
 * Renders `element` under a real `RunnerState` store (`mode: "builder"`), seeded from `runner`
 * and, optionally, an initial `builder` slice (`createRunnerStateStore` itself always starts
 * `builder` from `builderStateFactory()`, so a caller-supplied value is applied as one explicit
 * dispatch right after construction). Returns the store — see `renderWithProviders`.
 */
export function renderInBuilder(
  element: ReactElement,
  { runner = runnerDataFactory(), builder }: RenderInBuilderOptions = {},
): RunnerStateStore {
  const store = createRunnerStateStore({ mode: "builder", runner })
  if (builder) {
    store.dispatch(BuilderActions.setState({ ...store.getState().builder!, ...builder }))
  }

  const Wrapper: FC<PropsWithChildren> = ({ children }) => {
    return (
      <ThemeProvider theme={theme}>
        <TestRouterProvider>
          <RunnerStateProvider store={store}>
            <RunnerEntityProvider>
              <AddItemDialogProvider>{children}</AddItemDialogProvider>
            </RunnerEntityProvider>
          </RunnerStateProvider>
        </TestRouterProvider>
      </ThemeProvider>
    )
  }

  render(element, { wrapper: Wrapper })
  return store
}

/**
 * Fills the "Name" field in the last rendered MUI Dialog and clicks "Save".
 */
// MUI Dialog uses portals; querying the last dialog avoids stale portal nodes
// left over from previous tests.
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
 * Returns a React wrapper component that provides a real `RunnerState` store seeded from
 * `runnerData`. Pass it directly to `renderHook(..., { wrapper })`.
 */
export function makeRunnerDataWrapper(runnerData: RunnerData): FC<PropsWithChildren> {
  const store = createRunnerStateStore({ mode: "viewer", runner: runnerData })

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )
  Wrapper.displayName = "TestWrapper"

  return Wrapper
}
