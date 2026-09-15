import { configureStore } from "@reduxjs/toolkit"
import { Provider, useDispatch, useSelector, useStore } from "react-redux"

import type { BuilderState } from "#/components/builder/builderState.ts"
import { builderStateFactory } from "#/components/builder/builderState.ts"
import type { ItemCatalog } from "#/system/model/items/itemUtils.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"
import { getItemCatalog } from "#/system/model/runnerTraits.ts"

import { builderStoreReducer } from "./builder/builderStore.reducer.ts"
import type { EditorState } from "./editor/editor.state.ts"
import { editorStateFactory } from "./editor/editor.state.ts"
import { itemsRootReducer } from "./items/items.reducer.ts"
import { runnerRootReducer } from "./runner/runnerStore.reducer.ts"

/**
 * The single Redux state shape for one open Runner — Viewer, Builder, and Editor all read/write
 * through the same store instance (see ADR-0016). Despite the "app-wide" feel of a singleton
 * Redux store, this is always scoped to whichever Runner is currently open, not to the app as a
 * whole — there's a fresh store per mount of the Viewer/Builder/Editor route, not one shared for
 * the app's lifetime.
 */
export interface RunnerState {
  mode: "viewer" | "editor" | "builder"

  runner: RunnerData

  items: ItemCatalog

  builder: null | BuilderState
  editor: null | EditorState
}

export const createRunnerStateStore = (config: {
  mode: RunnerState["mode"]
  runner: RunnerData
  onChange?: (state: RunnerState) => void
}) => {
  const preloadedState: RunnerState = {
    mode: config.mode,
    runner: config.runner,
    items: getItemCatalog(config.runner),
    builder: builderStateFactory(),
    editor: editorStateFactory(config.runner),
  }

  const store = configureStore<RunnerState>({
    preloadedState: preloadedState,

    reducer: {
      mode: () => preloadedState.mode,

      runner: runnerRootReducer,
      items: itemsRootReducer,

      builder: (state = null, action) => {
        if (preloadedState.mode !== "builder") return state
        return builderStoreReducer(state ?? preloadedState.builder!, action)
      },

      editor: (state = null) => {
        if (preloadedState.mode !== "editor") return state
        return state ?? preloadedState.editor!
      },
    },
  })

  store.subscribe(() => {
    if (!config.onChange) return
    config.onChange(store.getState())
  })

  return store
}

export type RunnerStateStore = ReturnType<typeof createRunnerStateStore>
export const useRunnerStateStore = useStore.withTypes<RunnerStateStore>()

export type RunnerStateDispatch = RunnerStateStore["dispatch"]
export const useRunnerStateDispatch = useDispatch.withTypes<RunnerStateDispatch>()

export const useRunnerState = useSelector.withTypes<RunnerState>()

export const RunnerStateProvider = Provider
