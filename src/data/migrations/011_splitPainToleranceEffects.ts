import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

const VERSION = 11

interface LegacyEffect {
  type: string
  target?: string
  value: number
}

interface LegacyItemWithEffects {
  effects?: LegacyEffect[]
  [key: string]: unknown
}

type LegacyCharacter = {
  qualities?: LegacyItemWithEffects[]
  gear?: Record<string, LegacyItemWithEffects>
  spells?: LegacyItemWithEffects[]
  complexForms?: LegacyItemWithEffects[]
  adeptPowers?: LegacyItemWithEffects[]
}

function migrateEffects(effects: LegacyEffect[] | undefined): void {
  if (!Array.isArray(effects)) return
  for (const effect of effects) {
    if (effect.type !== "painTolerance") continue
    effect.type = effect.value < 0 ? "lowPainTolerance" : "highPainTolerance"
  }
}

const migration: CharacterMigration<LegacyCharacter> = {
  version: VERSION,
  up: (character) => {
    return produce(character, (draft) => {
      for (const quality of draft.qualities ?? []) {
        migrateEffects(quality.effects)
      }

      for (const item of Object.values(draft.gear ?? {})) {
        migrateEffects(item.effects)
      }

      for (const spell of draft.spells ?? []) {
        migrateEffects(spell.effects)
      }

      for (const complexForm of draft.complexForms ?? []) {
        migrateEffects(complexForm.effects)
      }

      for (const adeptPower of draft.adeptPowers ?? []) {
        migrateEffects(adeptPower.effects)
      }
    })
  },
}

export default migration
