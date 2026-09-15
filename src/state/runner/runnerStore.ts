import type { RunnerData } from "#/system/model/runnerData.ts"

export interface RunnerStore {
  getState: () => RunnerData
  setState: (updater: (prev: RunnerData) => RunnerData) => void
  subscribe: (listener: (state: RunnerData) => void) => { unsubscribe: () => void }
  /**
   * Redirects every future `getState`/`setState`/`subscribe` call to `delegate` instead of this
   * store's own standalone value — lets a store created up front (e.g. to seed a test) become a
   * live view over a different, already-authoritative store once one exists.
   */
  redirectTo: (delegate: Omit<RunnerStore, "redirectTo">) => void
}
