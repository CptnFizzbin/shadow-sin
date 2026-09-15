import { ThemeProvider } from "@mui/material/styles"
import { createMemoryHistory, createRootRoute, createRouter, RouterContextProvider } from "@tanstack/react-router"
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import type { FC, PropsWithChildren, ReactElement } from "react"
import { useMemo } from "react"
import { afterEach } from "vitest"

import { builderStateFactory } from "#/components/builder/builderState.ts"
import { createBuilderDataStore } from "#/components/builder/builderDataStore.ts"
import { AddItemDialogProvider } from "#/components/entities/items/dialogs/addItemDialogProvider.tsx"
import { RunnerDataStore } from "#/components/runner/runnerDataStore.ts"
import { RunnerEntityProvider } from "#/components/runner/runnerEntityProvider.tsx"
import { RunnerStoreProvider } from "#/components/runner/runnerStoreProvider.tsx"
import { BuilderActions } from "#/state/builder/builderStore.actions.ts"
import type { BuilderStore } from "#/state/builder/builderStore.ts"
import { RunnerStateProvider, createRunnerStateStore } from "#/state/runnerState.ts"
import { RunnerActions } from "#/state/runner/runnerStore.actions.ts"
import type { RunnerStore } from "#/state/runner/runnerStore.ts"
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
        <TestRouterProvider>
          <RunnerStoreProvider store={runnerStore}>
            <AddItemDialogProvider>{children}</AddItemDialogProvider>
          </RunnerStoreProvider>
        </TestRouterProvider>
      </ThemeProvider>
    )
  }

  return render(element, { wrapper: Wrapper })
}

/**
 * Seeds a fresh `RunnerDataStore`'s gear from the given map and renders `element` under it via
 * `renderWithProviders` — the `new RunnerDataStore(runnerDataFactory({ items: gear }))`
 * boilerplate every typed-card unit test (`SinDataCard`, `DeviceDataCard`, ...) otherwise repeats
 * for itself. Returns the store so callers can assert against it or seed a reactive wrapper
 * component keyed off it.
 */
export function renderWithRunner(element: ReactElement, gear: Record<string, ItemData> = {}) {
  const runnerStore = new RunnerDataStore(runnerDataFactory({ items: gear }))
  renderWithProviders(element, { runnerStore })
  return runnerStore
}

export function renderInBuilder(
  element: ReactElement,
  {
    runnerStore = new RunnerDataStore(runnerDataFactory()),
    builderStore = createBuilderDataStore(builderStateFactory()),
  }: RenderInBuilderOptions = {},
) {
  // `createRunnerStateStore` always seeds `builder` from `builderStateFactory()` — it has no way
  // to take a caller-supplied initial `BuilderState` — so a `builderStore` passed in with its own
  // starting value (e.g. a persisted `nuyen.starting`) is applied as one explicit dispatch below,
  // before `runnerStore`/`builderStore` are redirected to read/write through `appStore` directly.
  const appStore = createRunnerStateStore({
    mode: "builder",
    runner: runnerStore.getState(),
  })
  appStore.dispatch(BuilderActions.setState(builderStore.getState()))

  runnerStore.redirectTo({
    getState: () => appStore.getState().runner,
    setState: (updater) => appStore.dispatch(RunnerActions.update(updater)),
    subscribe: (listener) => {
      let previousRunner = appStore.getState().runner
      const unsubscribe = appStore.subscribe(() => {
        const nextRunner = appStore.getState().runner
        if (nextRunner === previousRunner) return
        previousRunner = nextRunner
        listener(nextRunner)
      })
      return { unsubscribe }
    },
  })

  builderStore.redirectTo({
    getState: () => appStore.getState().builder!,
    setState: (updater) => appStore.dispatch(BuilderActions.setState(updater(appStore.getState().builder!))),
    subscribe: (listener) => {
      let previousBuilder = appStore.getState().builder
      const unsubscribe = appStore.subscribe(() => {
        const nextBuilder = appStore.getState().builder
        if (nextBuilder === previousBuilder) return
        previousBuilder = nextBuilder
        listener(nextBuilder!)
      })
      return { unsubscribe }
    },
  })

  const Wrapper: FC<PropsWithChildren> = ({ children }) => {
    return (
      <ThemeProvider theme={theme}>
        <TestRouterProvider>
          <RunnerStateProvider store={appStore}>
            <RunnerEntityProvider>
              <AddItemDialogProvider>{children}</AddItemDialogProvider>
            </RunnerEntityProvider>
          </RunnerStateProvider>
        </TestRouterProvider>
      </ThemeProvider>
    )
  }

  return render(element, { wrapper: Wrapper })
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
