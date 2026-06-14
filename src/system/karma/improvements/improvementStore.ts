import type { UUID } from "node:crypto"

import type { Store } from "@tanstack/store"
import { createStore } from "@tanstack/store"
import { produce } from "immer"

import type { ImprovementEntry } from "./improvementEntry.ts"

export type ImprovementsState = Record<UUID, ImprovementEntry>

export class ImprovementStore {
  public readonly store: Store<ImprovementsState>

  constructor(value: ImprovementsState = {}) {
    this.store = createStore(value)
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
