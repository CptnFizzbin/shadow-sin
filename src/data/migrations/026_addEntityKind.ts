import { produce } from "immer"

import type { CharacterMigration } from "#/data/characterMigration.ts"

const VERSION = 26

interface OldItem {
  itemType?: string
  kind?: string
}

interface OldEntity {
  kind?: string
}

/**
 * Stamps `kind` (see `docs/features/0015-entity-interface-decomposition.md`) onto every
 * `RunnerData` subtree and onto `RunnerData` itself in one pass. `gear`'s items are only
 * stamped `kind: "item"` when they already have an `itemType` — a gear entry without one isn't a
 * recognizable Item shape and is left alone rather than guessed at.
 */
const migration: CharacterMigration<{
  kind?: string
  gear?: Record<string, OldItem>
  spirits?: OldEntity[]
  sprites?: OldEntity[]
  gameState?: { matrix?: { knownNodes?: OldEntity[] } }
  qualities?: OldEntity[]
  spells?: OldEntity[]
  complexForms?: OldEntity[]
  powers?: OldEntity[]
}> = {
  version: VERSION,
  up: (character) => {
    return produce(character, (draft) => {
      draft.kind ??= "runner"

      if (draft.gear) {
        for (const item of Object.values(draft.gear)) {
          if (item.itemType !== undefined) {
            item.kind ??= "item"
          }
        }
      }

      for (const spirit of draft.spirits ?? []) spirit.kind ??= "spirit"
      for (const sprite of draft.sprites ?? []) sprite.kind ??= "sprite"
      for (const node of draft.gameState?.matrix?.knownNodes ?? []) node.kind ??= "matrixNode"
      for (const quality of draft.qualities ?? []) quality.kind ??= "quality"
      for (const spell of draft.spells ?? []) spell.kind ??= "spell"
      for (const complexForm of draft.complexForms ?? []) complexForm.kind ??= "complexForm"
      for (const power of draft.powers ?? []) power.kind ??= "adeptPower"
    })
  },
}

export default migration
