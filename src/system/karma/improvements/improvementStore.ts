import { produce } from "immer"

import type { CompatStore } from "#/integrations/reduxToolkit/compatStore.ts"
import { createCompatStore } from "#/integrations/reduxToolkit/compatStore.ts"
import type { UUID } from "#/lib/uuidUtils.ts"

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

  // called widely on improvementStore instances (e.g. improvementActiveSkillList.tsx)
  // fallow-ignore-next-line unused-class-member
  remove(entry: UUID | ImprovementEntry) {
    const id = typeof entry === "string" ? entry : entry.id

    this.store.setState(produce((state) => {
      delete state[id]
    }))
  }

  // called in spendKarmaDialogContent.tsx
  // fallow-ignore-next-line unused-class-member
  removeAll() {
    this.store.setState(() => ({}))
  }
}
