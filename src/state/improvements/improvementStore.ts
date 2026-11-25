import { produce } from "immer"

import type { UUID } from "#/common/uuid/uuidUtils.ts"
import type { ImprovementEntry } from "#/data/karma/improvements/improvementEntry.ts"
import type { CompatStore } from "#/state/reduxToolkit/compatStore.ts"
import { createCompatStore } from "#/state/reduxToolkit/compatStore.ts"

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
