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

export interface RootState {
  mode: "viewer" | "editor" | "builder"

  runner: RunnerData

  items: ItemCatalog

  builder: null | BuilderState
  editor: null | EditorState
}

export const createRootStore = (config: {
  mode: RootState["mode"]
  runner: RunnerData
  onChange?: (state: RootState) => void
}) => {
  const preloadedState: RootState = {
    mode: config.mode,
    runner: config.runner,
    items: getItemCatalog(config.runner),
    builder: builderStateFactory(),
    editor: editorStateFactory(config.runner),
  }

  const store = configureStore<RootState>({
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

export type AppStore = ReturnType<typeof createRootStore>
export const useAppStore = useStore.withTypes<AppStore>()

export type AppDispatch = AppStore["dispatch"]
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

export type AppState = RootState
export const useAppSelector = useSelector.withTypes<AppState>()

export const AppStateProvider = Provider
