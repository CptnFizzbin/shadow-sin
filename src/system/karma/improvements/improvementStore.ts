import type { UUID } from "node:crypto"

import { produce } from "immer"

import type { CompatStore } from "#/integrations/reduxToolkit/compatStore.ts"
import { createCompatStore } from "#/integrations/reduxToolkit/compatStore.ts"

import type { ImprovementEntry } from "./improvementEntry.ts"

export type ImprovementsState = Record<UUID, ImprovementEntry>

export class ImprovementStore {
  public readonly store: CompatStore<ImprovementsState>

  constructor(value: ImprovementsState = {}) {
    this.store = createCompatStore(value)
  }

  add(entry: Omit<ImprovementEntry, "id">): ImprovementEntry {
    const id = crypto.randomUUID()

    const newEntry = { ...entry, id } as ImprovementEntry
    this.store.setState(produce((state) => {
      state[id] = newEntry
    }))

    return newEntry
  }

  remove(entry: UUID | ImprovementEntry) {
    const id = typeof entry === "string" ? entry : entry.id

    this.store.setState(produce((state) => {
      delete state[id]
    }))
  }

  removeAll() {
    this.store.setState(() => ({}))
  }
}
