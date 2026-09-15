import type { BuilderState } from "#/components/builder/builderState.ts"

export interface BuilderStore {
  getState: () => BuilderState
  setState: (updater: (prev: BuilderState) => BuilderState) => void
  subscribe: (listener: (state: BuilderState) => void) => { unsubscribe: () => void }
  /**
   * Redirects every future `getState`/`setState`/`subscribe` call to `delegate` instead of this
   * store's own standalone value — lets a store created up front (e.g. to seed a test) become a
   * live view over a different, already-authoritative store once one exists.
   */
  redirectTo: (delegate: Omit<BuilderStore, "redirectTo">) => void
}
